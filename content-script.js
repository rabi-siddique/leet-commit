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

function renderButton() {
  let button = document.createElement('div');
  button.innerHTML = 'Add Code';
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
  chrome.storage.sync.set({ code }, () => {});
}

// Send message to background script to initiate the code sending process
chrome.runtime.sendMessage({ message: 'initiate-sending-code' });

const sendCodeButtonCSS = `
.sendCodeButton {
  box-sizing: border-box;
  font-weight: 400;
  margin: 0;
  font-family: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 20px;
  transition: all 0.18s ease-in-out 0s;
  outline: 0;
  cursor: pointer;
  border: 1px solid #ff9800;
  border-radius: 3px;
  color: #ff9800;
  height: 24px;
  padding: 0 7px;
  font-size: 12px;
  margin-right: 25px;
}

.sendCodeButton:hover {
  background-color: #ff9800;
  color: #fff;
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
