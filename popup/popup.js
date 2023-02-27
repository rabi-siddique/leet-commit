chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'send-directories') {
    const directories = request.data[0];
    const apiKey = request.data[1];
    const select = document.getElementById('directory-select');

    // Add each directory as an option in the select element
    directories.forEach((directory) => {
      const option = document.createElement('option');
      option.value = directory.path;
      option.textContent = directory.path;
      select.appendChild(option);
    });
  }
});

// When the popup is opened, it sends a message to the background script
// with the message "send-message". The background script listens for this message.
// And responds by sending a message to all active popups with the directories.
chrome.runtime.sendMessage({ message: 'send-message' });
