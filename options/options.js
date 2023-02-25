const apiKeyInput = document.getElementById('api-key-input');
const saveButton = document.getElementById('save-button');

// Load the saved API key (if any) when the options page is opened
chrome.storage.sync.get('apiKey', ({ apiKey }) => {
  if (apiKey) {
    apiKeyInput.value = apiKey;
  }
});

// Save the API key when the user clicks the save button
saveButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value;
  chrome.storage.sync.set({ apiKey });
});
