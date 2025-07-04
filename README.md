# AI Chat - Local Llama Whisper Chat

A modern, professional chat application for local AI conversations. Built with React, TypeScript, and Tailwind CSS. Connects to your local Llama/Whisper models for private, fast, and customizable AI chat.

## Features
- **Local AI Chat**: All conversations run on your machine, no cloud required.
- **Multiple Models**: Easily switch between different local models (Llama, Whisper, etc.).
- **Conversation History**: Each conversation is tied to a single model and keeps its own message history.
- **Sidebar Navigation**: Quickly switch between conversations, create new ones, or delete old ones.
- **Modern UI**: Responsive, mobile-friendly, with smooth animations and a clean look.
- **Export/Import**: Download all your data as a JSON file, or import it back later.
- **Sticky Input Bar**: Always accessible at the bottom for fast messaging.
- **Multiline Support**: Messages support multiline text and auto-wrap.
- **Dark/Light Mode**: Toggle between themes for your comfort.

## How to Use
1. **Start the App**: The app will auto-create a new conversation for your default model.
2. **Send Messages**: Type your message and press Enter or click Send. Messages are grouped by conversation and model.
3. **Switch Models**: Use the model selector at the top to start a new conversation with a different model.
4. **Manage Conversations**: Use the sidebar to switch, create, or delete conversations. Each conversation is linked to a single model.
5. **Export Data**: Go to Settings and click "Export Data" to download all your conversations and settings.
6. **Import Data**: Use "Import Data" in Settings to restore your previous data.

## Running Locally
1. **Install dependencies**:
   ```bash
   npm install
   ```
2. **Start the development server**:
   ```bash
   npm run dev
   ```
3. **Open your browser** at [http://localhost:8080](http://localhost:8080)

## Requirements
- Node.js 16+
- Local Llama/Whisper models (see project documentation for setup)

## License
MIT. Free for personal and commercial use.

---
For more details, see the full documentation in the code and comments.
