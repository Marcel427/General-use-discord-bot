# Gnereal-use-discord-bot
A multi usage discord bot for moderation, fun and more

# 🤖 General Use Discord Bot

Welcome! This README is your **complete, step-by-step guide** to getting this Discord bot running from scratch. Every detail you need is here — no outside instructions. Follow along and your bot will be live in no time.

---

## 🧰 Prerequisites

### 1. Install Node.js and npm

Node.js runs JavaScript outside the browser; npm manages packages.

- Download from [https://nodejs.org](https://nodejs.org) (choose LTS version)
- After installation, open terminal/command prompt and run:

node -v
npm -v

You should see version numbers printed (e.g. `v18.x.x` and `9.x.x`).

---

### 2. (Optional) Install Git

If you want to clone the project directly:

- Download and install Git: [https://git-scm.com/](https://git-scm.com/)
- Check with:

git --version

yaml
Kopieren
Bearbeiten

---

## 🚀 Download Bot Source Code

### Option A: Clone using Git

Run this in terminal:

git clone https://github.com/Marcel427/Gnereal-use-discord-bot.git
cd Gnereal-use-discord-bot

yaml
Kopieren
Bearbeiten

### Option B: Download ZIP from GitHub

1. Go to https://github.com/Marcel427/Gnereal-use-discord-bot  
2. Click **Code > Download ZIP**  
3. Extract ZIP file and open the folder in your terminal or code editor

---

## 📦 Install Node Modules

In your project directory, run:

npm install

markdown
Kopieren
Bearbeiten

This installs dependencies like:
- `discord.js` (connects bot to Discord)
- `mongoose` (MongoDB driver)
- `chalk` (colored console output)

---

## 🛠 Setup Your Discord Bot

### 1. Create a Discord Application

- Visit [Discord Developer Portal](https://discord.com/developers/applications)
- Click **New Application**, name your bot, then click **Create**
- In your application, go to **Bot** tab → click **Add Bot**

### 2. Get Your Bot Token

- In Bot tab, click **Reset Token** (if not created yet)
- Click **Copy** to save token (keep this secret!)

### 3. Enable Privileged Gateway Intents

In Bot settings, enable:

- **MESSAGE CONTENT INTENT**  
- **GUILD MEMBERS INTENT**

This allows the bot to read messages and access member info.

### 4. Invite Bot to Your Server

- Go to **OAuth2 > URL Generator**  
- Under Scopes, select `bot` and `applications.commands`  
- Under Bot Permissions, enable:
  - Send Messages
  - Embed Links
  - Read Message History
  - Use Slash Commands (optional)  
- Copy generated URL, paste it into your browser, and invite the bot to your server

---

## ☁️ Setup MongoDB (Free Cloud Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up  
2. Create a free Shared Cluster  
3. Create a Database User with username and password  
4. Under Network Access, add your IP address or `0.0.0.0/0` (allows all)  
5. Click **Connect > Connect your application**  
6. Copy the provided connection string (looks like `mongodb+srv://<user>:<pass>@cluster0.mongodb.net/<dbname>?retryWrites=true&w=majority`)

---

## ⚙️ Configure the Bot

Open `config.json` file in the project root and replace placeholders:

```json
{
  "token": "YOUR_DISCORD_BOT_TOKEN",
  "db": "YOUR_MONGODB_CONNECTION_STRING",
  "consoleReady": true,
  "color": "#5865F2"
}
