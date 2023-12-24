const socket = io();

const loginForm = document.getElementById('login-form');
const chatContainer = document.querySelector('.chat-container');
const loginContainer = document.querySelector('.login-container');
const usernameInput = document.getElementById('username');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('.room-name');
const userList = document.getElementById('users');

// Login functionality
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    loginContainer.classList.add('d-none');
    chatContainer.classList.remove('d-none');
    socket.emit('joinRoom', { username, room: 'General' });
  }
});

// Send a regular chat message
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const messageInput = document.getElementById('msg').value;
  socket.emit('chatMessage', messageInput);
  document.getElementById('msg').value = '';
});

// Send a private message
document.getElementById('send-private').addEventListener('click', () => {
  const recipient = document.getElementById('private-msg').value;
  const privateMessage = document.getElementById('private-message').value.trim();

  if (privateMessage) {
    socket.emit('chatMessage', `/pm ${recipient} ${privateMessage}`);
    displayMessage(`(Private to ${recipient}): ${privateMessage}`);
  }

  document.getElementById('private-msg').value = '';
  document.getElementById('private-message').value = '';
});

function displayMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p>${message}</p>`;
  chatMessages.appendChild(div);
}

// Display messages in the chat
socket.on('message', (message) => {
  outputMessage(message);
});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Output message function
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p><strong>${message.username}</strong>: ${message.text}</p>`;
  chatMessages.appendChild(div);
}

// Output room name function
function outputRoomName(room) {
  roomName.innerText = room;
}

// Output users function
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
