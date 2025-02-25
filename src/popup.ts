import { ICONS } from './icons';
import { renameCurrentTab, addNewRule } from './actions';

interface Rule {
  urlPattern: string;
  newTitle: string;
}

interface Settings {
  renameShortcut: string;
  addRuleShortcut: string;
}

// Function to set up icons
function setupIcons() {
  const editIcon = document.getElementById('edit-icon') as HTMLImageElement;
  const addIcon = document.getElementById('add-icon') as HTMLImageElement;
  const settingsIcon = document.getElementById('settings-icon') as HTMLImageElement;

  editIcon.src = ICONS.edit;
  addIcon.src = ICONS.add;
  settingsIcon.src = ICONS.settings;
}

function setupSettings() {
  const settingsButton = document.getElementById('settingsButton');
  const closeSettings = document.getElementById('closeSettings');
  const settingsMenu = document.getElementById('settingsMenu');
  const renameInput = document.getElementById('renameShortcut') as HTMLInputElement;
  const addRuleInput = document.getElementById('addRuleShortcut') as HTMLInputElement;

  settingsButton?.addEventListener('click', () => {
    settingsMenu?.classList.add('visible');
  });

  closeSettings?.addEventListener('click', () => {
    settingsMenu?.classList.remove('visible');
  });

  [renameInput, addRuleInput].forEach((input) => {
    if (!input) return;

    input.addEventListener('focus', () => {
      input.placeholder = 'Type shortcut...';

      const handler = (e: KeyboardEvent) => {
        e.preventDefault();
        const keys = [];
        if (e.ctrlKey) keys.push('Ctrl');
        if (e.shiftKey) keys.push('Shift');
        if (e.altKey) keys.push('Alt');
        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt') {
          keys.push(e.key.toUpperCase());
        }
        input.value = keys.join('+');
      };

      input.addEventListener('keydown', handler);
      input.addEventListener(
        'blur',
        () => {
          input.removeEventListener('keydown', handler);
          input.placeholder = 'Click to record';
          // Save settings
          saveSettings();
        },
        { once: true }
      );
    });
  });
}

async function saveSettings() {
  const settings: Settings = {
    renameShortcut: (document.getElementById('renameShortcut') as HTMLInputElement).value,
    addRuleShortcut: (document.getElementById('addRuleShortcut') as HTMLInputElement).value,
  };
  await chrome.storage.sync.set({ settings });
}

async function loadSettings() {
  const defaultSettings: Settings = {
    renameShortcut: navigator.platform.includes('Mac') ? 'Command+B' : 'Ctrl+B',
    addRuleShortcut: '',
  };

  const { settings = defaultSettings } = await chrome.storage.sync.get('settings');

  const renameInput = document.getElementById('renameShortcut') as HTMLInputElement;
  const addRuleInput = document.getElementById('addRuleShortcut') as HTMLInputElement;

  if (renameInput) renameInput.value = settings.renameShortcut;
  if (addRuleInput) addRuleInput.value = settings.addRuleShortcut;
}

// Function to display all rules
async function displayRules() {
  const rules: Rule[] = await chrome.storage.sync.get('rules').then((data) => data.rules || []);
  const rulesListElement = document.getElementById('rulesList');
  const rulesListContainer = document.querySelector('.rules-list');
  if (!rulesListElement || !rulesListContainer) return;

  // Show/hide the rules list container based on whether there are rules
  if (rules.length > 0) {
    rulesListContainer.classList.add('has-rules');
  } else {
    rulesListContainer.classList.remove('has-rules');
  }

  rulesListElement.innerHTML = '';
  rules.forEach((rule, index) => {
    const ruleElement = document.createElement('div');
    ruleElement.className = 'rule-item';
    ruleElement.innerHTML = `
      <div>
        <strong>Contains:</strong> ${rule.urlPattern}<br>
        <strong>Title:</strong> ${rule.newTitle}
      </div>
      <button class="delete-rule" data-index="${index}">
        <img class="icon" src="${ICONS.delete}" alt="delete">
      </button>
    `;
    rulesListElement.appendChild(ruleElement);
  });

  // Add delete handlers
  document.querySelectorAll('.delete-rule').forEach((button) => {
    button.addEventListener('click', async (e) => {
      const index = parseInt((e.target as HTMLElement).getAttribute('data-index') || '0');
      rules.splice(index, 1);
      await chrome.storage.sync.set({ rules });
      displayRules();
    });
  });
}

// Autofill current URL
async function autofillCurrentUrl() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab.url) {
    const urlInput = document.getElementById('urlPattern') as HTMLInputElement;
    urlInput.value = new URL(tab.url).hostname;
  }
}

// Initialize
if (chrome.extension?.getViews({ type: 'popup' }).length === 1) {
  document.addEventListener(
    'DOMContentLoaded',
    () => {
      setupIcons();
      setupSettings();
      loadSettings();
      displayRules();
      autofillCurrentUrl();

      clearEventListeners(document.getElementById('renameTab') as HTMLElement)?.addEventListener(
        'click',
        renameCurrentTab
      );
      clearEventListeners(document.getElementById('addRule') as HTMLElement)?.addEventListener('click', async () => {
        const urlPattern = (document.getElementById('urlPattern') as HTMLInputElement)?.value;
        const newTitle = (document.getElementById('newTitle') as HTMLInputElement)?.value;

        await addNewRule(urlPattern, newTitle);
        await displayRules();

        // Check if the current tab matches the new rule
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab.url?.includes(urlPattern)) {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id! },
            func: (title) => {
              document.title = title;
            },
            args: [newTitle],
          });
        }
      });
    },
    { once: true }
  );
}

function clearEventListeners(element: HTMLElement) {
  const clonedElement = element.cloneNode(true);
  element.parentNode?.replaceChild(clonedElement, element);
  return clonedElement;
}
