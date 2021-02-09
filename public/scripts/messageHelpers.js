 //fakeConversation
 const convos = [
  conversation1 = {
    id: 1,
    username: 'Dave',
    item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
    item_name: 'Dour Bread from the sidewalk'
  },

  conversation2 = {
    id: 2,
    username: 'Bob',
    item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
    item_name: 'Rumbernuckel'
  },

  conversation3 = {
    id: 3,
    username: 'Jorn',
    item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
    item_name: 'This is actually salmon'
  },

  conversation4 = {
    id: 4,
    username: 'Jamananana',
    item_pic: 'https://i.imgur.com/RTSFzpL.jpg',
    item_name: 'Wheat Bread'
  }
]

const messages = [ {
  recipient: 'Dave',
  sender: 'Bob',
  message: "Hey I want your bread please"
  },

  {
    recipient: 'Bob',
    sender: 'Dave',
    message: 'Sure it is the amount on the posting'
  },

  {
    recipient: 'Dave',
    sender: 'Bob',
    message: 'Frankly that is unreasonable'
  }
];

const user = {userID: 43, name: 'Bob'};



// Helper functions for the messaging script
const fillWindow = (window, object, generatorFunction) => {
  window.empty();
  window.append(generatorFunction(object));
};

const generateChatWindow = () => {
  $chatWindow = $(`<div id='chatWindow'>
  </div>`)
  return $chatWindow;
};


const generateConversations = (elements) => {
  let $conversation = `<i class="far fa-envelope"></i>`;
  for (const instance of elements) {
    $conversation += `
    <div id='${instance.id}' class="conversation">
      <img src="${instance.item_pic}">
      <h4>${instance.username}</h4>
      <p> Chatting about ${instance.item_name} </p>
    </div>`;

    $('nav').on('click', '#' + instance.id, function (event) {
      fillWindow($chatWindow, messages, generateAllMessages );
    });
  }

  return $conversation;
};

const generateControls = () => {
  return `
  <div class='controls'>
    <label for "newMessage">New Message:</label>
    <textarea name="newMessage" id="newMessage"></textarea>
    <button class='send'>Send</button>
    <button class='back'>Back</button>
  </div>
  `
};

const generateAllMessages = (elements) => {
  let $allMessages = ``;
  for (const message of elements) {
    if(user.name === message.sender) {
      $allMessages +=`
      <div class='mes buy'>
        <p><span class='sender'>${message.sender}</span> : ${message.message} </p>
      </div>
      `
    } else {
      $allMessages +=`
      <div class='mes sell'>
        <p><span class='sender'>${message.sender}</span> : ${message.message} </p>
      </div>
      `
    }
  }

  $('nav').on('click', '.back', function (event) {
    fillWindow($chatWindow, convos, generateConversations );
  });

  $allMessages += generateControls();
  return $allMessages;
};

const appendSingleMessage = (window, message) => {
  //Will be implemented to append the most recent message after it is sent
}



