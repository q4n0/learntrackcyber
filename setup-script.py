#!/usr/bin/env python3
import os
import platform
import subprocess
import sys
import urllib.request
import zipfile
import shutil

def is_windows():
    return platform.system().lower() == "windows"

def is_linux():
    return platform.system().lower() == "linux"

def download_file(url, filename):
    print(f"Downloading {filename}...")
    urllib.request.urlretrieve(url, filename)

def run_command(command):
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"Error running command: {e}")
        sys.exit(1)

def setup_windows():
    # Download and install Node.js
    if not shutil.which("node"):
        print("Installing Node.js...")
        download_file("https://nodejs.org/dist/v18.16.0/node-v18.16.0-x64.msi", "node_installer.msi")
        run_command("msiexec /i node_installer.msi /quiet /qn")
        os.remove("node_installer.msi")

    # Download and install Git
    if not shutil.which("git"):
        print("Installing Git...")
        download_file("https://github.com/git-for-windows/git/releases/download/v2.41.0.windows.1/Git-2.41.0-64-bit.exe", "git_installer.exe")
        run_command("git_installer.exe /VERYSILENT")
        os.remove("git_installer.exe")

def setup_linux():
    # Install Node.js and Git using package manager
    if not shutil.which("node"):
        print("Installing Node.js...")
        run_command("curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -")
        run_command("sudo apt-get install -y nodejs")

    if not shutil.which("git"):
        print("Installing Git...")
        run_command("sudo apt-get install -y git")

def main():
    print("Setting up Cybersecurity Learning Tracker...")
    
    if is_windows():
        setup_windows()
    elif is_linux():
        setup_linux()
    else:
        print("Unsupported operating system")
        sys.exit(1)

    # Clone the repository
    print("Cloning repository...")
    run_command("git clone https://github.com/q4n0/learntrackcyber.git")
    os.chdir("cybersecurity-tracker")

    # Install dependencies
    print("Installing dependencies...")
    run_command("npm install")

    # Build the application
    print("Building application...")
    if is_windows():
        run_command("npm run package-win")
    else:
        run_command("npm run package-linux")

    print("Setup complete! You can find the executable in the dist folder.")

if __name__ == "__main__":
    main()
