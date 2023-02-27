function main() {
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(function observe() {
    let element = document.getElementsByClassName('container__2zYY');
    if (element.length != 0) {
      renderButton();
      observer.disconnect();
    }
  });
  observer.observe(document, config);
}

main();

function getCode() {
  let lines = [];
  let element = document.getElementsByClassName('CodeMirror-line');
  for (let i = 0; i < element.length; i++) {
    lines.push(normalizeCode(element[i].innerText));
  }
  const code = lines.join('\n');
  return code;
}

function normalizeCode(str) {
  let re = new RegExp(String.fromCharCode(160), 'g');
  str = str
    .replace(re, ' ')
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/Ä/g, 'A')
    .replace(/Ö/g, 'O')
    .replace(/[^\000-\177]/g, '');
  return str;
}

async function renderButton() {
  let button = document.createElement('div');
  button.innerText = 'Send Code';
  button.classList.add('sendCodeButton');
  addCSS(sendCodeButtonCSS);
  let codePanel = document.getElementsByClassName('container__2zYY')[0];

  if (codePanel) {
    codePanel.append(button);
    button.addEventListener('click', sendCode);
  }
}

function sendCode() {
  const code = getCode();
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === 'send-code') {
      chrome.runtime.sendMessage({
        message: 'sending-code',
        data: code,
      });
    }
  });
}

const sendCodeButtonCSS = `
.sendCodeButton {
  width: 100px;
  height: 40px;
  margin-right:20px;
  padding: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  background-color: #333333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  transition: background-color 0.2s ease-in-out;
}

.sendCodeButton:hover {
  background-color: #4a4a4a;
}

.sendCodeButton:active {
  transform: translateY(1px);
  box-shadow: none;
}
`;

function addCSS(css) {
  const styleElement = document.createElement('style');
  styleElement.appendChild(document.createTextNode(css));
  document.head.appendChild(styleElement);
}
