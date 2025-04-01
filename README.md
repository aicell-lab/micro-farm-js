# micro-farm-js

**micro-farm-js** is a TypeScript-based project using [Three.js](https://threejs.org/) to create a 3D virtual laboratory environment. It allows users to explore and interact with a simulated microscopy farm. The project is built and bundled with [Vite](https://vitejs.dev/) for fast and modern development.

---

## Features

- 🎨 **3D Environment**: Rendered with Three.js.
- 🛠️ **TypeScript**: Type safety.
- ⚡ **Vite for Development**: Bundling and hot module replacement.

---

## Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/)
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

Run `setup-assets.sh` to download and unzip the asset files.

```bash
sh ./setup-assets.sh
```

This will download asset files separately and store them in a directory named `public`.

### Code Overview

`index.html` runs the main application and renders it on a `<canvas>`. The user interface (UI) is composed of DOM elements defined in both `index.html` and `styles.css`. While the app is loading, a temporary loading screen overlay (`#overlay` in `index.html`) is displayed.

`sceneSystem.ts` defines the `SceneSystem` class, which manages the core simulation loop of the application.

This class coordinates several subsystems, including:
- **Physics simulation** via `PhysicsSystem`
- **Input handling** through `InputListener`
- **3D scene rendering** with Three.js (`renderScene`)
- **UI interactions** through `UIMediator`
- **Player and table control logic** via `Controllers`
- **Event coordination** through `EventMediator`

The `runSimulationLoop()` method drives the frame-by-frame updates using `requestAnimationFrame`, calling `processFrame()` on each tick. Within each frame, input is processed, player visibility is toggled, controllers are updated, the physics engine is stepped forward, and the scene is rendered.

This class acts as the main coordinator for all runtime behavior, combining physics, input, and UI logic into a continuous real-time simulation.

#### Physics

Physics simulation in this project is being developed using Ammo.js, a JavaScript/WebAssembly port of the Bullet Physics engine. The goal is to simulate a robotic arm defined in a URDF (Unified Robot Description Format) file.

While URDF-based simulations are well-supported in Python via PyBullet, Ammo.js only provides a subset of the full Bullet API. As a result, setting up physics with URDFs in Ammo.js is more involved and requires custom setup scripts to manually define joints, constraints, and physical properties.

This feature is currently a work-in-progress, and full integration of Ammo.js into the simulation loop has not yet been completed. The groundwork is being laid to support articulated physics objects such as robotic arms in the near future.

##### Visualizing Physics Colliders

Given that AmmoJS provides only a limited subset of the full Bullet Physics API it may be helpful to introduce visualization tools into the project to improve the development experience. For example, rendering visual representations of `btRigidBody` and `btCollisionShape` objects directly would simplify debugging.

## Diagram

```mermaid
flowchart TD
  %% Initialization section
  subgraph Initialization
    Factory -->|Initialize| Containers
    Containers["Containers<br>(EntityCollection)"] -->|Stores| Data["Data<br>(Entity)"]
  end
  
  Loop -->|Loop| Runtime
  
  %% Runtime section
  subgraph Runtime
    Mediators -->|Coordinate| Controllers
  end

  %% External Interfaces
  subgraph External["External Interfaces"]
    Keyboard["Keyboard & Mouse"]
    UI["HTML, CSS"]
    Network
  end

  %% Simulation
  subgraph Simulation["Simulation"]
    Physics
    Robot["Robot"]
    Optics["Optics"]
  end

  %% Entry and Setup
  Main["Main"] -->|Fetch| Initialization
  Main -->|Load| Assets
  Main -->|Run| Loop

  %% One connection from Runtime to each
  Runtime -->|Sync| External
  Runtime -->|Update| Simulation

