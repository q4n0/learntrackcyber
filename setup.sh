#!/bin/bash

# Function to detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     echo "Linux";;
        CYGWIN*|MINGW32*|MSYS*|MINGW*) echo "Windows";;
        *)          echo "UNKNOWN:${unameOut}";;
    esac
}

# Function to check and install Node.js
install_node() {
    if ! command -v node &> /dev/null; then
        echo "Node.js not found. Installing..."
        if [ "$OS" == "Linux" ]; then
            curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
            sudo apt-get install -y nodejs
        elif [ "$OS" == "Windows" ]; then
            choco install nodejs -y
        fi
    else
        echo "Node.js is already installed."
    fi
}

# Function to check and install Git
install_git() {
    if ! command -v git &> /dev/null; then
        echo "Git not found. Installing..."
        if [ "$OS" == "Linux" ]; then
            sudo apt-get install -y git
        elif [ "$OS" == "Windows" ]; then
            choco install git -y
        fi
    else
        echo "Git is already installed."
    fi
}

# Function to setup the project
setup_project() {
    echo "Setting up the Cybersecurity Learning Tracker..."
    
    # Clone the repository
    git clone https://github.com/q4n0/learntrackcyber.git
    cd learntrackcyber

    # Install dependencies
    npm install

    # Build the project
    npm run build

    echo "Setup completed successfully!"
}

# Main script execution
OS=$(detect_os)
echo "Detected OS: $OS"

if [ "$OS" == "Windows" ]; then
    # Check if Chocolatey is installed
    if ! command -v choco &> /dev/null; then
        echo "Chocolatey not found. Please install Chocolatey first."
        echo "Run the following command in an administrator PowerShell:"
        echo "Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))"
        exit 1
    fi
fi

# Install prerequisites
install_node
install_git

# Setup the project
setup_project

echo "Installation complete. You can now run the app with 'npm run dev' in the project directory."
