---
title: Get amazing at VS Code 🚀
description: This guide is aimed at helping you become a VS Code Wizard 🧙‍♂️
sidebar:
  label: VS Code guide
---

This guide is aimed at helping you becoma a VS Code Wizard 🧙‍♂️. It's a work in progress, so if you have any suggestions, please let us know! It will teach you concepts and shortcuts that will make you a better and faster developer. Do not try to use all of these at once, but rather pick one or two at a time and practice them until they become second nature.

## The Command Palette 🎨

The command palette is the most important tool in VS Code. It allows you to do anything in VS Code, and it's the fastest way to do it. It's also the quickest way to find out what you can do in VS Code. It's the one thing you should learn first.

To open the command palette, press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>.

## Settings ⚙️

Find the settings by pressing <kbd>Ctrl</kbd> + <kbd>,</kbd> or opening the Command Palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) and searching for "Settings". Consider changing the default behavior from the UI to using a JSON-file to make it easier to search for settings and to copy-paste settings from others.

## Shortcuts 🚴

Change and add new shortcuts by opening the Command Palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) and searching for "Keyboard Shortcuts". Access the JSON-version with the "Open Keyboard Shortcuts (JSON)" command.

### Jumping Horizontally ↔️

#### Jumping one character at a time

- <kbd>Right</kbd> - Move cursor one character to the right ➡️
- <kbd>Left</kbd> - Move cursor one character to the left ⬅️

#### Jumping to the beginning/end of a word

- <kbd>Ctrl</kbd> + <kbd>Left</kbd> - Jump to the beginning of the word 🏁
- <kbd>Ctrl</kbd> + <kbd>Right</kbd> - Jump to the end of the word 🏁
- Enable camelCase Navigation to jump between words in camelCase variables. Here's how to enable it in your shortcuts.json:

```json
[
  {
    "key": "ctrl+right",
    "command": "cursorWordPartRight",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+shift+right",
    "command": "cursorWordPartRightSelect",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+left",
    "command": "cursorWordPartLeft",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+shift+left",
    "command": "cursorWordPartLeftSelect",
    "when": "textInputFocus"
  },
  {
    "key": "ctrl+backspace",
    "command": "deleteWordPartLeft",
    "when": "textInputFocus && !editorReadonly"
  },
  {
    "key": "ctrl+shift+backspace",
    "command": "deleteWordPartRight",
    "when": "textInputFocus && !editorReadonly"
  }
]
```

#### Jumping to the beginning/end of a line

- <kbd>Home</kbd> - Jump to the beginning of the line 🏠
- <kbd>End</kbd> - Jump to the end of the line 🏁

### Jumping Vertically ↕️

#### Jumping one line at a time

- <kbd>Up</kbd> - Jump one line up ⬆️
- <kbd>Down</kbd> - Jump one line down ⬇️

#### Jumping to the beginning/end of a file

- <kbd>Ctrl</kbd> + <kbd>Home</kbd> - Jump to the beginning of the file 📄
- <kbd>Ctrl</kbd> + <kbd>End</kbd> - Jump to the end of the file 📄

## Selecting Text 📝

Select text with <kbd>Shift</kbd> and any movement command. A neat trick is to select a whole line by jumping to the end and then selecting backwards. This can be done by pressing <kbd>Shift</kbd> + <kbd>End</kbd> and then <kbd>Shift</kbd> + <kbd>Left</kbd>. Which of course works in the other direction.

## Navigating Files 📂

- <kbd>Ctrl</kbd> + <kbd>P</kbd> - Open the file search, shows recently opened files 🔍
- <kbd>Ctrl</kbd> + <kbd>Tab</kbd> - Switch between open files 🔁
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Tab</kbd> - Switch between open files in reverse order 🔙
- <kbd>Ctrl</kbd> + <kbd>Page Down</kbd> - Go to the next file ⏭️
- <kbd>Ctrl</kbd> + <kbd>Page Up</kbd> - Go to the previous file ⏮️

## Navigating the UI 🖥

- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>E</kbd> - Open Explorer 🗂
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F</kbd> - Open Search 🔍
- <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>H</kbd> - Open Replace 🔠
- <kbd>Ctrl</kbd> + <kbd>B</kbd> - Open/Hide Sidebar 🥷
- <kbd>Ctrl</kbd> + <kbd>1</kbd> - Focus on the first panel, usually takes you back to your code editor 🧐

## Editing ✏️

### IntelliSense 💡

IntelliSense provides code completion and suggestions. Activate it with <kbd>Ctrl</kbd> + <kbd>Space</kbd>.

### Quick Fix 🔧

Quick Fix offers suggestions for code errors. Activate it with <kbd>Ctrl</kbd> + <kbd>.</kbd>.

### Go to Definition 🔍

Jump to the definition of a variable or function with <kbd>F12</kbd> or <kbd>Ctrl</kbd> + <kbd>Click</kbd>.

### Find all references 🔍

Find all references to a variable or function with <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>F12</kbd>.

### Errors ⚠️

Jump to errors and warnings with <kbd>F8</kbd> (next) and <kbd>Shift</kbd> + <kbd>F8</kbd> (previous).

### Imports 📦

Organize imports, sorting them and removing unused ones, with <kbd>Alt</kbd> + <kbd>Shift</kbd> + <kbd>O</kbd>.

### Comments

Toggling line comments works both for single lines and for multiple lines <kbd>Ctrl</kbd> + <kbd>'</kbd> 🗨️

## Extensions 🧩

### Editing Web Apps 💻

- [EditorConfig for VS Code](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig): Ensures consistency in code.
- [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens): Adds Git insights directly in the editor.
- [Select Line Status](https://marketplace.visualstudio.com/items?itemName=tomoki1207.selectline-statusbar): Displays selected lines in the status bar.
- [IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode): Provides AI-assisted IntelliSense by showing recommended completion items for your code context at the top of the completions list.
- [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer): Launch a development local Server with live reload feature for static & dynamic pages.
- [Path Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.path-intellisense): Autocomplete file names.
- [CodeSnap](https://marketplace.visualstudio.com/items?itemName=adpyke.codesnap): Take beautiful screenshots of your code
- [YAML](https://marketplace.visualstudio.com/items?itemName=redhat.vscode-yaml): Support for YAML files by Red Hat.
- [Rainbow CSV](https://marketplace.visualstudio.com/items?itemName=mechatroner.rainbow-csv): Highlight CSV columns.

### JavaScript & TypeScript

- [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome): Formatter and linter, can replace ESLint and Prettier.
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint): Integrates ESLint JavaScript linting.
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode): Code formatter.
- [Pretty TypeScript Errors](https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors): Makes errors pretty and human-readable.
- [Twoslash Query Comments](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-twoslash-queries): Highlights types in JS and TS files when using the `// ^?` comment.

### CSS

- [CSS Variable Autocomplete](https://marketplace.visualstudio.com/items?itemName=vunguyentuan.vscode-css-variables): For working with CSS variables.
- [Tailwind CSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss): Tailwind class autocompletion.

### Markdown 📝

- [Markdown All in One](https://marketplace.visualstudio.com/items?itemName=yzhang.markdown-all-in-one)
- [markdownlint](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)
