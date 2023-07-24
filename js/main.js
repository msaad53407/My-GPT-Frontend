
// Getting DOM Elements
const newChatButton = document.querySelector('.chats__window-new-chat'),
  sidebar = document.querySelector('.sidebar'),
  chatsMessageContainer = document.querySelector('.chats__messages'),
  chatsSidebar = document.querySelector('.chats__sidebar'),
  chatsWindow = document.querySelector('.chats__window'),
  sendIcon = document.querySelector('.chats__bottom-bar-send-icon'),
  inputPrompt = document.getElementById('promptInput'),
  settingsButton = document.querySelector('.sidebar__settings'),
  settingsWindow = document.querySelector('.sidebar__settings-window'),
  profileSubmitButton = document.getElementById('sidebar__settings-submit-button'),
  profileUserName = document.getElementById('user__name'),
  sidebarInfoName = document.getElementById('sidebar__personal-name'),
  settingsWindowImage = document.querySelector('.sidebar__settings-image'),
  imageSelectorWindow = document.querySelector('.sidebar__image-selector'),
  sidebarImageContainer = Array.from(document.querySelectorAll('.sidebar__image-container')),
  sidebarSelectButton = document.querySelector('.sidebar__settings-select-button'),
  userPic = document.querySelector('.sidebar__personal-image'),
  sidebarClock = document.querySelector('.sidebar__clock'),
  chatsWindowClock = document.querySelector('.chats__window-clock'),
  chatsClockToggleButton = document.querySelector('.chats__clock__toggle-button'),
  chatsSettingsToggleButton = document.querySelector('.chats__settings__toggle-button'),
  sidebarCloseButton = document.querySelector('.sidebar__close-button')

// Setting and Displaying Time
setInterval(() => {
  let hours = new Date().getHours()
  let minutes = new Date().getMinutes()
  let seconds = new Date().getSeconds()
  let timeSetting;

  timeSetting = hours >= 12 ? 'PM' : 'AM'
  hours = hours > 12 ? hours - 12 : hours
  hours = hours === 0 ? 12 : hours
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  sidebarClock.innerHTML = `<div class="sidebar__clock-time"><p>${hours} :</p><p>${minutes} :</p><p>${seconds}</p><p>${timeSetting}</p><div>`
  chatsWindowClock.innerHTML = `<div class="chats__window-clock-time"><p>${hours} :</p><p>${minutes} :</p><p>${seconds}</p><p>${timeSetting}</p><div>`
}, 500)


// Getting data from database to display
window.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('http://localhost:3000/download');
  const nameData = await response.json()
  userPic.firstElementChild.src = nameData.info.userSrc
  settingsWindowImage.firstElementChild.src = nameData.info.userSrc
  profileUserName.value = nameData.info.userName
  sidebarInfoName.innerText = nameData.info.userName
})


// Template to add messages to chat window
const generateMessageCard = () => {
  const chatsMessagesCard = document.createElement('div'),
    chatsMessagesProfile = document.createElement('div'),
    chatsMessagesProfileAvatar = document.createElement('div'),
    imgTag = document.createElement('img'),
    chatsMessagesProfileName = document.createElement('div'),
    paraTagName = document.createElement('p'),
    paraTagMessage = document.createElement('p'),
    chatsMessageProfileMessage = document.createElement('div');

  chatsMessagesCard.classList.add('chats__messages-card')
  chatsMessagesProfile.classList.add('chats__messages__profile')
  chatsMessagesProfileAvatar.classList.add('chats__messages__profile-avatar')
  chatsMessagesProfileName.classList.add('chats__messages__profile-name')
  chatsMessageProfileMessage.classList.add('chats__messages__profile-message')

  chatsMessagesCard.insertAdjacentElement('beforeend', chatsMessagesProfile)
  chatsMessagesCard.insertAdjacentElement('beforeend', chatsMessageProfileMessage)

  chatsMessagesProfile.insertAdjacentElement('beforeend', chatsMessagesProfileAvatar)
  chatsMessagesProfile.insertAdjacentElement('beforeend', chatsMessagesProfileName)

  chatsMessagesProfileAvatar.appendChild(imgTag)
  chatsMessagesProfileName.appendChild(paraTagName)
  chatsMessageProfileMessage.appendChild(paraTagMessage)

  return [chatsMessagesCard, imgTag, paraTagName, paraTagMessage]
}

// Main Chatting Function
const startChatting = async () => {
  const promptMessage = inputPrompt.value
  inputPrompt.value = ''

  // Adding user chat card
  const [chatsMessagesUserCard, imgTagUser, paraTagNameUser, paraTagMessageUser] = generateMessageCard();
  chatsMessagesUserCard.classList.add('user-card')
  chatsMessagesUserCard.classList.remove('ai-card')

  imgTagUser.src = './assets/user.svg'
  imgTagUser.alt = 'user-icon'

  paraTagNameUser.innerText = '...'
  paraTagMessageUser.innerText = promptMessage

  chatsMessageContainer.insertAdjacentElement('beforeend', chatsMessagesUserCard)
  localStorage.setItem('userCard', JSON.stringify(chatsMessagesUserCard))

  // API call to backend to get name info
  const response = await fetch('http://localhost:3000/download');
  const data = await response.json()
  paraTagNameUser.innerText = data.info.userName
  imgTagUser.src = data.info.userSrc

  // Adding AI chat card with a delay of 700ms
  setTimeout(async () => {
    const [chatsMessagesCard, imgTag, paraTagName, paraTagMessage] = generateMessageCard();
    chatsMessagesCard.classList.add('ai-card')
    chatsMessagesCard.classList.remove('user-card')

    imgTag.src = './assets/bot.svg'
    imgTag.alt = 'ai-icon'

    paraTagName.innerText = 'MyGPT'
    paraTagMessage.innerText = '...'

    chatsMessageContainer.insertAdjacentElement('beforeend', chatsMessagesCard)

    // API call to send promptMessage to backend 
    const response = await fetch('http://localhost:3000', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptMessage
      })
    })
    const AIReply = await response.json()
    paraTagMessage.innerText = AIReply.bot || '.....'
  }, 700)
}

const showChatWindow = () => {
  newChatButton.classList.add('hide')
}
// newChatButton.addEventListener('click', showChatWindow)

// Settings Window toggler
settingsButton.addEventListener('click', () => {
  settingsButton.firstElementChild.classList.toggle('toggle')
  settingsWindow.classList.toggle('active')
  settingsWindow.classList.contains('active') ? imageSelectorWindow.classList.add('active') : imageSelectorWindow.classList.remove('active')
})

settingsWindowImage.addEventListener('click', () => {
  imageSelectorWindow.classList.toggle('active')
})

chatsClockToggleButton.addEventListener('click', () => {
  chatsWindowClock.classList.toggle('visible')
})

chatsSettingsToggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('visible')
})

sidebarCloseButton.addEventListener('click', () => {
  sidebar.classList.toggle('visible')
})

sidebarImageContainer.forEach(container => {
  container.addEventListener('click', function () {
    sidebarImageContainer.forEach(elem => {
      elem.removeAttribute('data-active')
    })
    this.setAttribute('data-active', 'true')
    sidebarSelectButton.removeAttribute('disabled')
  })
})

sidebarSelectButton.addEventListener('click', async () => {
  sidebarSelectButton.setAttribute('disabled', true)
  const src = document.querySelector('[data-active]').firstElementChild.src
  const modifiedSrc = src.replace('http://localhost:5173/assets/', `./assets/`)
  settingsWindowImage.firstElementChild.src = modifiedSrc
  userPic.firstElementChild.src = modifiedSrc
  fetch('http://localhost:3000/iconUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newIconSrc: modifiedSrc
    })
  })
})

// Updating data from Settings Window to database and DOM
profileSubmitButton.addEventListener('click', async () => {
  settingsWindow.classList.toggle('active')
  imageSelectorWindow.classList.remove('active')
  sidebarInfoName.innerText = '...'
  const response = await fetch('http://localhost:3000/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      newName: profileUserName.value
    })
  })
  const data = await response.json()
  profileUserName.value = data.info
  sidebarInfoName.innerText = data.info
})


sendIcon.addEventListener('click', startChatting)
inputPrompt.addEventListener('keypress', e => {
  e.key === 'Enter' ? startChatting() : 0
})