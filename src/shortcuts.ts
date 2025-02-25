import { renameCurrentTab, addNewRule } from './actions';

interface Settings {
  renameShortcut: string;
  addRuleShortcut: string;
}

function parseShortcut(shortcut: string) {
  const keys = shortcut.split('+');
  return {
    ctrl: keys.includes('Ctrl'),
    cmd: keys.includes('Command'),
    shift: keys.includes('Shift'),
    alt: keys.includes('Alt'),
    key: keys[keys.length - 1],
  };
}

function matchesShortcut(e: KeyboardEvent, shortcut: string): boolean {
  const parsed = parseShortcut(shortcut);
  const isMac = navigator.platform.includes('Mac');

  const matchesModifier = isMac ? (parsed.cmd && e.metaKey) || (parsed.ctrl && e.ctrlKey) : parsed.ctrl && e.ctrlKey;

  return (
    matchesModifier && parsed.shift === e.shiftKey && parsed.alt === e.altKey && e.key.toUpperCase() === parsed.key
  );
}

// Only listen for shortcuts if we're not in the popup
if (!chrome.extension?.getViews({ type: 'popup' }).length) {
  document.addEventListener('keydown', async (e) => {
    const { settings } = await chrome.storage.sync.get('settings');
    if (!settings) return;

    if (matchesShortcut(e, settings.renameShortcut)) {
      e.preventDefault();
      await renameCurrentTab();
    } else if (settings.addRuleShortcut && matchesShortcut(e, settings.addRuleShortcut)) {
      e.preventDefault();
      await addNewRule();
    }
  });
}
