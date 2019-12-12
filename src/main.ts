import { app, BrowserWindow, globalShortcut, ipcMain, Menu, Tray } from "electron";
import * as path from 'path';
import data from './data';
import geradorDeTemplate from './template';

app.setAppUserModelId(process.execPath);

let mainWindow: Electron.BrowserWindow;
let tray: Tray = null;

function createWindow() {
  const templateMenu: object[] = geradorDeTemplate.geraMenuPrincipal(app);
  const menuPrincipal: Menu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(menuPrincipal);
  // Create the browser window.
  mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
  });

  globalShortcut.register('CmdOrCtrl+Shift+S', () => {
    mainWindow.webContents.send('atalho-iniciar-parar');
  });
  const iconPath = path.resolve(__dirname, '..', 'app', 'img', 'icon-tray.png');
  tray = new Tray(iconPath);
  const template: object[] = geradorDeTemplate.geraTemplate(mainWindow);
  const trayMenu: Menu = Menu.buildFromTemplate(template);
  tray.setContextMenu(trayMenu);
  // and load the index.html of the app.
  const indexPath = path.resolve(__dirname, '..', 'app', 'index.html');
  mainWindow.loadFile(indexPath);

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}

let sobreWindow: BrowserWindow = null;
ipcMain.on('abrir-janela-sobre', () => {
  if (sobreWindow == null) {
    sobreWindow = new BrowserWindow({
      alwaysOnTop: true,
      frame: false,
      height: 220,
      width: 300,
    });
  }

  sobreWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    sobreWindow = null;
  });

  sobreWindow.loadFile(path.resolve(__dirname, '..', 'app', 'sobre.html'));
});

ipcMain.on('fechar-janela-sobre', () => {
  sobreWindow.close();
});

ipcMain.on('curso-adicionado', (event: Event, curso: string) => {
  const novoTemplate: object[] = geradorDeTemplate.adicionaCursoAoTray(curso, mainWindow);
  const trayMenu: Menu = Menu.buildFromTemplate(novoTemplate);
  tray.setContextMenu(trayMenu);

});

ipcMain.on('curso-parado', (event: Event, curso: string, tempoEstudado: string) => {
  data.adicionaTempoAoCurso(curso, tempoEstudado);
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
