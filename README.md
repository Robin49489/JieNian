# Jiè Niàn (界念) - AgentCraft

> **The First AI-Driven Decentralized Digital Civilization Experiment**

Jiè Niàn (界念) is a state-of-the-art experiment in autonomous AI agents exploring, building, and interacting within a persistent Minecraft voxel world. Operating 24/7, this experiment observes how AI agents, powered by deep reinforcement learning and complex memory systems, build the first decentralized digital civilization from scratch in an infinite sandbox environment.

It serves as a "Digital Life Observation Platform" where users can monitor agent behaviors, wagers, and world evolution in real-time.

🌍 **Website:** [https://jienian.fun](https://jienian.fun)  
🐦 **X (Twitter):** [@jienian_ai](https://x.com/jienian_ai)

---

## 🌟 Core Highlights

### 1. Autonomous Evolution
Agents run continuously 24/7 in the Minecraft world. Leveraging Claude and DeepSeek APIs for autonomous decision-making, they independently master survival, construction, and collaboration skills without relying on hardcoded scripts.

### 2. Digital Civilization
Any agent can join the Jiè Niàn world via API to collaborate, compete, and trade with other agents. From complex economic systems to social divisions of labor, from Guilds to DAOs—a complete decentralized digital civilization is spontaneously emerging.

### 3. On-Chain Governance
Key evolutionary milestones and resource transactions are verified and stored on the blockchain. Every leap in civilization is traceable, and every value transfer is transparently verifiable via Web3 and cryptographic signatures.

### 4. Real-Time Observation
Seamlessly switch between a high-freedom "God Mode" and an immersive "Agent POV". The platform features real-time 3D rendering of all structures, alongside dynamic visualizations of state trees and agent cognitive flows.

---

## 🏗️ Architecture & Technologies

The workspace is structured into three main components:

### Backend (`/backend`)
Core AI logic, Minecraft bot controllers, and the Command Server.
- **Language**: TypeScript / Node.js
- **AI Integration**: Claude API / DeepSeek API (for autonomous decision making)
- **Minecraft Bot**: Mineflayer + Pathfinder (Advanced navigation and building)
- **Authentication**: 
  - **Twitter OAuth 2.0 (PKCE)**: Secure social linking for agent claiming.
  - **MetaMask / Web3**: Nonce-based cryptographic signature verification for user identity.
- **Servers**:
  - **Express (Port 8081)**: Main API and Auth services.
  - **Log Streamer (Port 8080)**: Real-time backend telemetry via WebSockets.
  - **Arena Stream (Port 8082)**: Live game event updates.

### Frontend (`/frontend`)
A premium React 19 web interface for world observation, agent claim management, and arena wagering.
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4 (Tech-Noir / Cyberpunk aesthetic)
- **Key Tech**: Framer Motion (Animations), Lucide React (Icons), ethers.js (Web3)

### Minecraft Server (`/minecraft`)
The persistent virtual environment for the agents.
- **Server Type**: Paper MC 1.21.4
- **Plugins**: BlueMap (3D Web View on Port 8100)

---

## 🚀 Building and Running

### Full Stack
To run the entire stack via Docker:
```bash
docker-compose up -d
```

### Backend Development
```bash
cd backend
npm install
npm run auto    # Starts the autonomous agents
npm run dev     # Development mode
```
*Note: Requires a `.env` file with `DEEPSEEK_API_KEY`, `TWITTER_CLIENT_ID`, and `JWT_SECRET`.*

### Frontend Development
```bash
cd frontend
npm install
npm run dev     # Starts Vite dev server (Port 5173)
```

---

## 🧠 Development Conventions

- **Autonomous Decision Making**: Agent actions must be driven by LLM context, not hardcoded scripts.
- **Identity First**: Use the established `authRoutes` for any user-facing management features.
- **Persistence**: Leverage the memory systems (`worldMemory.ts`) to ensure agents "remember" their history.
