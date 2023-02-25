const apiKeyInput = document.getElementById('api-key-input');
const ownerInput = document.getElementById('owner-input');
const repoInput = document.getElementById('repo-input');
const saveButton = document.getElementById('save-button');

// Load the saved API key, owner, and repo (if any) when the options page is opened
chrome.storage.sync.get(
  ['apiKey', 'owner', 'repo'],
  ({ apiKey, owner, repo }) => {
    if (apiKey) {
      apiKeyInput.value = apiKey;
    }
    if (owner) {
      ownerInput.value = owner;
    }
    if (repo) {
      repoInput.value = repo;
    }
  }
);

// Save the API key, owner, and repo when the user clicks the save button
saveButton.addEventListener('click', () => {
  const apiKey = apiKeyInput.value;
  const owner = ownerInput.value;
  const repo = repoInput.value;
  chrome.storage.sync.set({ apiKey, owner, repo });
});

// Check if the input fields are empty or contain less than 50 characters
const checkInput = () => {
  if (
    apiKeyInput.value.length === 0 ||
    ownerInput.value.length === 0 ||
    repoInput.value.length === 0
  ) {
    saveButton.disabled = false;
  } else {
    saveButton.disabled = true;
  }
};

// Add event listener to the input fields to check their length
apiKeyInput.addEventListener('input', checkInput);
ownerInput.addEventListener('input', checkInput);
repoInput.addEventListener('input', checkInput);

// Check input fields on page load in case the user has already entered data
checkInput();
