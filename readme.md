# Cybersecurity Learning Tracker

An interactive Electron application built with Next.js for tracking your cybersecurity learning journey. This application helps you manage your progress through various cybersecurity learning paths, complete with spaced repetition review system and interactive exercises.

![Application Screenshot](placeholder-screenshot.png)

## 🚀 Features

- 📚 Comprehensive learning paths covering various cybersecurity topics
- 📆 Spaced repetition system for effective learning
- ✅ Progress tracking and completion certificates
- 💻 Interactive coding exercises
- 📱 Cross-platform support (Windows, Linux)
- 🎓 Beginner-friendly interface with advanced topics

## 🔧 Prerequisites

Before you begin, ensure you have met the following requirements:

### Windows
- [Git for Windows](https://gitforwindows.org/)
- [Node.js](https://nodejs.org/) (v18 or later)
- [Chocolatey](https://chocolatey.org/install) (for automated setup)

### Linux
- Git
- Node.js (v18 or later)
- npm

## 💾 Installation

### Automatic Installation

We provide a setup script that handles the installation process automatically.

1. Clone the repository:
```bash
git clone https://github.com/q4n0/learntrackcyber.git
cd learntrackcyber
```

2. Run the setup script:

#### For Linux:
```bash
chmod +x setup.sh
sudo ./setup.sh setup
```

#### For Windows (in Git Bash, as Administrator):
```bash
./setup.sh setup
```

### Manual Installation

If you prefer to install manually:

1. Clone the repository:
```bash
git clone https://github.com/q4n0/learntrackcyber.git
cd learntrackcyber
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

## 🎮 Usage

### Running the Application

#### Using the setup script:
```bash
./setup.sh run
```

#### Manually:
```bash
npm run dev
```

The application will start in development mode. The Electron window should appear automatically, loading the Next.js application.

### Learning Paths

1. Create your profile when first launching the app
2. Choose a learning path from the available options
3. Complete exercises and lessons
4. Review topics when prompted by the spaced repetition system
5. Track your progress through the dashboard

## 🏗️ Building

To build the application for distribution:

### For Windows:
```bash
npm run package-win
```

### For Linux:
```bash
npm run package-linux
```

Packaged applications will be available in the `dist` folder.

## 🔍 Troubleshooting

Common issues and their solutions:

1. **Node.js version conflicts**
   - Use nvm to manage Node.js versions
   ```bash
   nvm install 18
   nvm use 18
   ```

2. **Electron fails to start**
   - Check if all dependencies are installed
   ```bash
   npm install
   ```
   - Rebuild Electron
   ```bash
   npm rebuild electron
   ```

3. **Building fails**
   - Ensure you have sufficient disk space
   - Check if you have necessary build tools installed

## 🤝 Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 📊 Project Status

Current version: 1.0.0

This project is actively maintained. Check the [issues page](https://github.com/q4n0/learntrackcyber/issues) for upcoming features and known issues.

## 🔗 Links

- Repository: [GitHub](https://github.com/q4n0/learntrackcyber)
- Issue tracker: [GitHub Issues](https://github.com/q4n0/learntrackcyber/issues)

## 📁 Repository Structure

```
learntrackcyber/
├── src/
│   ├── components/
│   │   └── LearningTracker.tsx
│   ├── pages/
│   └── styles/
├── public/
├── main.js
├── package.json
├── setup.sh
└── README.md
```

## 🆘 Support

If you encounter any issues or need assistance:
1. Check the [Troubleshooting](#-troubleshooting) section
2. Look through existing [GitHub Issues](https://github.com/q4n0/learntrackcyber/issues)
3. Create a new issue if your problem isn't already reported

## 🔄 Recent Updates

- Initial release with core functionality
- Added cross-platform setup script
- Implemented spaced repetition system

## 📋 To-Do List

- [ ] Add more learning paths
- [ ] Implement user authentication
- [ ] Create mobile responsive design
- [ ] Add offline mode support
