// main.js
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
