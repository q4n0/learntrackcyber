#!/bin/bash

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS=Linux;;
        Darwin*)    OS=Mac;;
        CYGWIN*)    OS=Windows;;
        MINGW*)     OS=Windows;;
        MSYS*)      OS=Windows;;
        *)          OS="UNKNOWN"
    esac
    echo $OS
}

# Function to check and install requirements for Linux
install_linux_requirements() {
    echo "Checking system requirements for Linux..."
    
    # Check Node.js version
    if ! command -v node &> /dev/null; then
        echo "Node.js is not installed. Installing..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt-get install -y nodejs
    fi
    
    # Check npm version
    if ! command -v npm &> /dev/null; then
        echo "npm is not installed. Installing..."
        sudo apt-get install -y npm
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        echo "git is not installed. Installing..."
        sudo apt-get install -y git
    fi
}

# Function to check and install requirements for Windows
install_windows_requirements() {
    echo "Checking system requirements for Windows..."
    
    # Check if Chocolatey is installed
    if ! command -v choco &> /dev/null; then
        echo "Chocolatey is not installed. Please run the following command in an Administrator PowerShell:"
        echo 'Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString("https://chocolatey.org/install.ps1"))'
        exit 1
    fi
    
    # Install requirements using Chocolatey
    if ! command -v node &> /dev/null; then
        echo "Installing Node.js..."
        choco install nodejs -y
    fi
    
    if ! command -v git &> /dev/null; then
        echo "Installing Git..."
        choco install git -y
    fi
}

# Function to set up the project
setup_project() {
    echo "Setting up the project..."
    
    # Remove existing directory if it exists
    if [ -d "learntrackcyber" ]; then
        echo "Removing existing learntrackcyber directory..."
        rm -rf learntrackcyber
    fi
    
    # Clone the repository
    echo "Cloning the repository..."
    git clone https://github.com/q4n0/learntrackcyber.git
    cd learntrackcyber || exit 1
    
    # Create package.json using the build-scripts.json content
    echo "Creating package.json..."
    cat > package.json << 'EOL'
{
  "name": "cybersecurity-learning-tracker",
  "version": "1.0.0",
  "description": "A comprehensive cybersecurity learning application",
  "main": "main.js",
  "scripts": {
    "dev": "concurrently \"next dev\" \"electron .\"",
    "build": "next build && next export",
    "start": "next start",
    "lint": "next lint",
    "electron-build": "electron-builder -c.extraMetadata.main=main.js",
    "package": "npm run build && npm run electron-build",
    "package-win": "npm run build && electron-builder --win",
    "package-linux": "npm run build && electron-builder --linux"
  },
  "build": {
    "appId": "com.cybersecurity.learningtracker",
    "productName": "Cybersecurity Learning Tracker",
    "files": [
      "main.js",
      "out/**/*",
      "node_modules/**/*"
    ],
    "win": {
      "target": "nsis",
      "icon": "public/icon.ico"
    },
    "linux": {
      "target": "AppImage",
      "icon": "public/icon.png",
      "category": "Education"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true
    }
  },
  "devDependencies": {
    "electron": "^22.0.0",
    "electron-builder": "^24.4.0",
    "electron-is-dev": "^2.0.0",
    "concurrently": "^8.0.1"
  }
}
EOL
    
    # Create main.js for Electron
    echo "Creating main.js..."
    cat > main.js << 'EOL'
const { app, BrowserWindow } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const { setupTitlebar, attachTitlebarToWindow } = require('custom-electron-titlebar/main')

setupTitlebar()

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    titleBarStyle: 'hidden'
  })

  attachTitlebarToWindow(win)

  // Load the Next.js app
  if (isDev) {
    win.loadURL('http://localhost:3000')
    win.webContents.openDevTools()
  } else {
    win.loadFile('./out/index.html')
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
EOL
    
    # Install dependencies
    echo "Installing dependencies..."
    npm install next react react-dom @types/node @types/react typescript
    npm install tailwindcss postcss autoprefixer
    npm install custom-electron-titlebar
    npm install @radix-ui/react-progress @radix-ui/react-tabs @radix-ui/react-accordion
    npm install lucide-react
    
    # Initialize Next.js project
    echo "Initializing Next.js project..."
    npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git --force
    
    # Create components directory and copy LearningTracker component
    mkdir -p src/components
    echo "Creating LearningTracker component..."
    cat > src/components/LearningTracker.tsx << 'EOL'
$(cat learning-tracker.tsx)
EOL
    
    echo "Setup completed successfully!"
}

# Function to run the project
run_project() {
    echo "Running the project..."
    if [ ! -d "learntrackcyber" ]; then
        echo "Project not found. Please run setup first."
        exit 1
    fi
    cd learntrackcyber
    npm run dev
}

# Main script execution
OS=$(detect_os)

# Process command line arguments
COMMAND=$1

case $COMMAND in
    setup)
        echo "Starting setup process..."
        case $OS in
            Linux)
                install_linux_requirements
                ;;
            Windows)
                install_windows_requirements
                ;;
            *)
                echo "Unsupported operating system: $OS"
                exit 1
                ;;
        esac
        setup_project
        ;;
    run)
        run_project
        ;;
    *)
        echo "Usage: $0 {setup|run}"
        echo "  setup - Install requirements and set up the project"
        echo "  run   - Run the project"
        exit 1
        ;;
esac
