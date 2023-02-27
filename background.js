chrome.storage.sync.get(
  ['apiKey', 'owner', 'repo'],
  async ({ apiKey, owner, repo }) => {
    // Return if apiKey, owner or repo are missing
    if (!apiKey || !owner || !repo) {
      return;
    }

    const url = `https://api.github.com/repos/${owner}/${repo}/contents`;
    const headers = new Headers({
      Authorization: `token ${apiKey}`,
    });

    const response = await fetch(url, { headers });
    const contents = await response.json();
    const directories = contents.filter((item) => item.type === 'dir');

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.message === 'send-message') {
        chrome.runtime.sendMessage({
          message: 'send-directories',
          data: [directories, apiKey],
        });
      }
    });
  }
);
