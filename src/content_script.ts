(async () => {
  const newTitle = prompt('Enter a new title for the tab');
  if (newTitle) {
    document.title = newTitle;
  }
})();
