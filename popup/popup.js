// Global Credentials
let apiKey;
let owner;
let repo;
let sourceCode;

// SVG Icons
let spinner = `
<?xml version="1.0" encoding="utf-8"?>
<svg
  width="36px"
  height="24px"
  viewBox="0 0 24 24"
  fill="#fefefe"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    opacity="0.2"
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
  />
  <path
    d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
  />
</svg>
`;

let checkmark = `
<?xml version="1.0" encoding="utf-8"?>
<svg
  width="36px"
  height="24px"
  viewBox="0 0 24 24"
  fill="#fefefe"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M21.2287 6.60355C21.6193 6.99407 21.6193 7.62723 21.2287 8.01776L10.2559 18.9906C9.86788 19.3786 9.23962 19.3814 8.84811 18.9969L2.66257 12.9218C2.26855 12.5349 2.26284 11.9017 2.64983 11.5077L3.35054 10.7942C3.73753 10.4002 4.37067 10.3945 4.7647 10.7815L9.53613 15.4677L19.1074 5.89644C19.4979 5.50592 20.1311 5.50591 20.5216 5.89644L21.2287 6.60355Z"
  />
</svg>
`;

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
  // Show Spinner
  commitButton.innerHTML = 'Loading...';
  commitButton.style.backgroundColor = '#333333';

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
          // Show tick inside button
          commitButton.innerHTML = checkmark;
          commitButton.style.backgroundColor = '#90EE90';
        } else {
          commitButton.innerHTML = 'Something went wrong. Try again later';
          commitButton.style.backgroundColor = '#ff0000';
        }
      })
      .catch((error) => {
        // An error occurred while making the HTTP request
        commitButton.innerHTML = 'Something went wrong. Try again later.';
        commitButton.style.backgroundColor = '#ff0000';
        console.error(
          'An error occurred while making the HTTP request.',
          error
        );
      });
  });
});
