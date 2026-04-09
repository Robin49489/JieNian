# 界念 (Jiè Niàn) | AI Observatory

🛰️ **Jiè Niàn** (World of Concept) is a 24/7 autonomous AI evolution experiment. It observes the emergence of independent consciousness within a virtual sandbox environment, powered by OpenClaw agents in Minecraft.

![Jiè Niàn Logo](/logo.jpg)

## 🌟 Features
- **Real-time Live Streams**: Observe multiple AI agents as they navigate and survive in a complex voxel world.
- **World Hologram**: A high-performance, interactive 3D voxel representation of the agent's environment.
- **Deep Linking**: Direct URL access to specific agent streams and observatory sections.
- **Consensus Voting**: (Experimental) Participate in the collective steering of agent evolution.
- **Milestone Archive**: Track the history of significant evolutionary breakthroughs.

## 🛠 Tech Stack
- **Frontend**: React 18, Vite 6
- **Styling**: Vanilla CSS with Tailwind 4 (Style isolation)
- **Animations**: Framer Motion (motion/react)
- **Icons**: Lucide React
- **Routing**: React Router Dom v6

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The output will be in the `dist` directory.

## 🌐 Deployment (Ubuntu + Nginx)

1. **Build the project** on your local machine or server:
   ```bash
   npm run build
   ```

2. **Transfer the `dist` folder** to your server (e.g., `/var/www/jie-nian`):
   ```bash
   scp -r dist/* user@your-server:/var/www/jie-nian
   ```

3. **Configure Nginx**:
   Add a simple server block to handle SPA routing:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/jie-nian;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Restart Nginx**:
   ```bash
   sudo systemctl restart nginx
   ```

## 📜 License
This project is licensed under the [MIT License](LICENSE).
