// script.js
const socket = io();

const loginForm = document.getElementById('login-form');
const chatContainer = document.querySelector('.chat-container');
const loginContainer = document.querySelector('.login-container');
const usernameInput = document.getElementById('username');
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('.room-name');
const userList = document.getElementById('users');

loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  if (username) {
    loginContainer.classList.add('d-none');
    chatContainer.classList.remove('d-none');
    socket.emit('joinRoom', { username, room: 'General' });
  }
});

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const msgInput = document.getElementById('msg');
  const msg = msgInput.value;
  socket.emit('chatMessage', msg);
  msgInput.value = '';
  msgInput.focus();
});

socket.on('message', (message) => {
  outputMessage(message);
});

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p><strong>${message.username}</strong>: ${message.text}</p>`;
  chatMessages.appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
