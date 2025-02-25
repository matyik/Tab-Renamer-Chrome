export async function renameCurrentTab() {
  console.log('renameCurrentTab');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.id) {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['dist/content_script.js'],
    });
  }
}

export async function addNewRule(inputUrlPattern?: string, inputNewTitle?: string) {
  console.log('addNewRule');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.url) return;

  const newTitle = inputNewTitle || prompt('Enter a new title for this URL pattern:');
  if (!newTitle) return;

  const urlPattern = inputUrlPattern || new URL(tab.url).hostname;
  const rules = await chrome.storage.sync.get('rules').then((data) => data.rules || []);

  rules.push({ urlPattern, newTitle });
  await chrome.storage.sync.set({ rules });
}
