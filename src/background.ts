chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id! },
    files: ['dist/content_script.js'] // use files to inject the content script.
  });
});
