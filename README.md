# Tab Renamer Chrome Extension

A lightweight Chrome extension that allows you to quickly rename browser tabs with a simple keyboard shortcut or click.

## Features

- Rename any tab with a custom title
- Keyboard shortcut support (Ctrl+B / Command+B)
- Simple and lightweight
- Works on any webpage

## Installation

1. Clone the repository:

```bash
git clone https://github.com/matyik/tab-renamer-chrome.git
cd tab-renamer-chrome
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the extension:

```bash
pnpm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` folder from your project directory

## Usage

- Click the extension icon in your toolbar, or
- Use the keyboard shortcut:
  - Windows/Linux: `Ctrl+B`
  - Mac: `Command+B`
- Enter your desired tab name in the prompt
- Press Enter to rename the tab

## Development

To start development with hot-reloading:

```bash
pnpm run watch
```

The extension uses:

- TypeScript for type safety
- Webpack for bundling
- Chrome Extension Manifest V3

## Project Structure

```
tab-renamer-chrome/
├── src/
│   ├── background.ts     # Extension background script
│   ├── content_script.ts # Content script for tab renaming
│   └── index.html       # Extension popup page
├── manifest.json        # Extension manifest
├── webpack.config.js    # Webpack configuration
└── tsconfig.json       # TypeScript configuration
```

## License

MIT License - feel free to use and modify as needed.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
