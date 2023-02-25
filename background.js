// Get the API key, owner, and repo from storage
chrome.storage.sync.get(
  ['apiKey', 'owner', 'repo'],
  async ({ apiKey, owner, repo }) => {
    // If any of the values are missing, log an error and return
    if (!apiKey || !owner || !repo) {
      console.error('Missing API key, owner, or repo');
      return;
    }

    // Construct the URL for the API request
    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;

    // Set up the request headers with the API key
    const headers = new Headers({
      Authorization: `token ${apiKey}`,
    });

    const response = await fetch(url, { headers });
    const contents = await response.json();
    const directories = contents.filter((item) => item.type === 'dir');
    console.log('directories', directories);
  }
);
