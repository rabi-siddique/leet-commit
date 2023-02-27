chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'send-directories') {
    const directories = request.data;
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

chrome.runtime.sendMessage({ message: 'send-message' });
