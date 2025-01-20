# micro-farm-js

**micro-farm-js** is a TypeScript-based project using [Three.js](https://threejs.org/) to create a 3D virtual laboratory environment. It allows users to explore and interact with a simulated microscopy farm. The project is built and bundled with [Vite](https://vitejs.dev/) for fast and modern development.

---

## Features

- 🎨 **Immersive 3D Environment**: Rendered with Three.js for rich visuals.
- 🛠️ **TypeScript Powered**: Fully typed, ensuring code quality and maintainability.
- ⚡ **Vite for Development**: Lightning-fast bundling and hot module replacement.
- 📁 **Customizable Assets**: Use external assets to enhance your environment.

---

## Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)

---

## Installation

   ```bash
   git clone git@github.com:aicell-lab/micro-farm-js.git
   cd micro-farm-js
   npm install
   npm run dev
   ```
### File Structure:
```plaintext
micro-farm-js/
├── index.html         # Entry HTML file
├── package.json       # Project metadata and dependencies
├── tsconfig.json      # TypeScript configuration
├── vite.config.ts     # Vite configuration
├── public/            # Public assets directory
│   ├── assets.zip     # (Download separately)
│   └── packages/      # URDF packages (Download separately)
├─── dist/             # Build output 
└─── src/              # Source code
```

### Assets
Download asset files separately and store them in a directory named `public`. There is a SciLifeLab Google Drive folder for the asset files ([link](https://drive.google.com/drive/folders/1g0Fn1z1HypzZXlIOSOknS61B0Xc6bXgN?usp=sharing)).
