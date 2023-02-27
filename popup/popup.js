// Global Credentials
let apiKey;
let owner;
let repo;
let sourceCode;

/* -------------------- Receiving Directories -------------------- */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'send-directories') {
    const directories = request.data[0];
    apiKey = request.data[1];
    owner = request.data[2];
    repo = request.data[3];
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

/* -------------------- Commit Code to Github -------------------- */

// Get the commit button element
const commitButton = document.getElementById('commit-button');

// Add a click event listener to the commit button
commitButton.addEventListener('click', () => {
  // Get the directory select and filename input elements
  const directorySelect = document.getElementById('directory-select');
  const filenameInput = document.getElementById('filename-input');

  // Get the selected directory and entered filename
  const selectedDirectory = directorySelect.value;
  const filename = filenameInput.value;

  // Get the commit message input element and entered commit message
  const commitMessageInput = document.getElementById('commit-message-input');
  const commitMessage = commitMessageInput.value;

  // Construct the API endpoint URL for creating a new file
  const path = `${selectedDirectory}/${filename}`;
  const endpoint = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;

  // Encode file content to base64
  chrome.storage.sync.get(['code'], ({ code }) => {
    sourceCode = code;
    const content = btoa(sourceCode);

    // Construct the request object
    const request = {
      method: 'PUT',
      headers: {
        Authorization: `token ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: commitMessage,
        content: content,
        path: path,
      }),
    };

    // Make the HTTP request to the GitHub API
    fetch(endpoint, request)
      .then((response) => {
        if (response.ok) {
          console.log('Code Commit Success');
        } else {
          console.log('Error occurred');
        }
      })
      .catch((error) => {
        // An error occurred while making the HTTP request
        console.error(
          'An error occurred while making the HTTP request.',
          error
        );
      });
  });
});
