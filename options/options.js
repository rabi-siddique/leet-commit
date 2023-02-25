/*------------- Allow User to Save their API key   -------------*/

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

/*------------- Get and Show All Databases   -------------*/

// Get the list element to display the databases
const databaseList = document.getElementById('database-list');

// Check if the API key is already saved
chrome.storage.sync.get('apiKey', ({ apiKey }) => {
  if (apiKey) {
    // Make a GET request to the /databases endpoint to load all the databases
    fetch('https://api.notion.com/v1/databases', {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Notion-Version': '2021-08-16',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the databases in the list element
        const databaseItems = data.results.map(
          (database) => `<li>${database.title[0].text.content}</li>`
        );
        databaseList.innerHTML = databaseItems.join('');
      })
      .catch((error) => {
        console.error('Error loading databases:', error);
      });
  }
});
