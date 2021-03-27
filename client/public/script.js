const socket = io("http://localhost:8000");
const chat = document.querySelector('.chat-form');
const Input = document.querySelector('.chat-input');
const chatWindow = document.querySelector('.chat-window')
const chatSection = document.querySelector('#chat-section')

const renderMessage = message => {
  const div = document.createElement('div')
  div.classList.add('render-message')
  div.innerText = message
  chatWindow.appendChild(div)
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chat.addEventListener('submit', event => {
  event.preventDefault()
  socket.emit('chat', Input.value)
  Input.value = ''
})

socket.on('chat', message => {
  renderMessage(message)
})

