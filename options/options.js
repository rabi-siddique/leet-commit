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

// Check if the input field is empty or contains less than 50 characters
const checkInput = () => {
  if (apiKeyInput.value.length === 0 || apiKeyInput.value.length < 50) {
    saveButton.disabled = true;
  } else {
    saveButton.disabled = false;
  }
};

// Add event listener to the input field to check its length
apiKeyInput.addEventListener('input', checkInput);
// Check input field on page load in case the user has already entered an API key
checkInput();
