interface Rule {
  urlPattern: string;
  newTitle: string;
}

// Listen for tab updates
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    const rules: Rule[] = await chrome.storage.sync.get('rules').then((data) => data.rules || []);

    for (const rule of rules) {
      if (tab.url.includes(rule.urlPattern)) {
        chrome.scripting.executeScript({
          target: { tabId },
          func: (newTitle) => {
            document.title = newTitle;
          },
          args: [rule.newTitle],
        });
        break;
      }
    }
  }
});

// // Handle extension icon click (now handled by popup.html)
// chrome.action.onClicked.removeListener();
