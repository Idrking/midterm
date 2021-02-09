const { render } = require('ejs');
const express = require('express');
const router  = express.Router();
const queries = require('../db/queries');
const printQuery = require('../lib/printQuery');

const reconstructConvoObjs = function(objArray, currentUserID) {
  let newArr = [];
  for (let obj of objArray) {
    let newObj = {};
    if (obj.buyer_id = currentUserID) {
      newObj.username = obj.seller_user_name;
    } else {
      newObj.username = obj.buyer_user_name;
    }
    newObj.item_pic = obj.photo_url;
    newObj.item_name = obj.name;
    newArr.push(newObj);
  }
  return newArr;
};

module.exports = (db) => {

  router.post("/create", (req, res) => {

    const newMessage = req.body.message;
    const targetListing = req.body.item;
    const senderID = req.session.userID;

    // check if conversation already exists
    db.query(`SELECT *
    FROM conversations
    WHERE listing_id = $1
    AND buyer_id = $2;
    `, [targetListing, senderID])
      .then((data)=>{
        if (data.rows.length !== 0) {
          // conversation exists, add new message to it. (proceed to next `then` statement)
          console.log('------------ Conversation exists.');
          return data;
        } else {
          // conversation does not exist, create it. (find seller first)
          console.log('------------ Conversation does not exist, creating it now.');
          return db.query('SELECT user_id FROM listings where id = $1', [targetListing])
            .then((data) => {
              const sellerID = data.rows[0].user_id;
              console.log(sellerID, senderID);
              return db.query(queries.createConversation, [targetListing, senderID, sellerID]);
            })
        }
      })
      .then((data) => {
        console.log('sending new message');
        const recipientID = data.rows[0].seller_id;
        return db.query(queries.createMessage, [senderID, recipientID, newMessage]);
      })
      .then((data) => {
        console.log('message sent, returning JSON');
        const sentMessage = JSON.stringify(data.rows[0]);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: sentMessage }));
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/conversation", (req, res) => {
    db.query(queries.listMessages)
      .then(data => {
        res.setHeader('Content-Type', 'application/json');
        // res.end(JSON.stringify({ message: sentMessage }));
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/conversations", (req, res) => {
    const currentUserID = req.session.userID;

    printQuery(queries.listConversations, [currentUserID, currentUserID]);
    db.query(queries.listConversations, [currentUserID, currentUserID])
      .then((data) => {
        const responseObj = JSON.stringify(reconstructConvoObjs(data.rows, currentUserID))
        // console.log(data.rows);
        console.log("Conversations count:", data.rowCount);
        console.log(responseObj);
        res.setHeader('Content-Type', 'application/json');
        res.end(responseObj);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
