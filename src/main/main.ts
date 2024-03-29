/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  Notification,
  dialog,
} from 'electron';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import { autoUpdater } from 'electron-updater';
import * as fspromises from 'fs/promises';
import { IFileForUpload, IFilePathForUpload } from 'models/IFileForUpload';
import electronDl from 'electron-dl';

autoUpdater.autoDownload = false;
electronDl({
  onCompleted(file) {
    mainWindow?.webContents.send('download-file-completed', file);
  },
  onCancel(item) {
    mainWindow?.webContents.send('download-file-cancel', item);
  },
  errorTitle: 'Ошибка загрузки',
  errorMessage: 'Загрузка {filename} была прервана',
});

let mainWindow: BrowserWindow | null = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const RESOURCES_PATH = app.isPackaged
  ? path.join(process.resourcesPath, 'assets')
  : path.join(__dirname, '../../assets');

const getAssetPath = (...paths: string[]): string => {
  return path.join(RESOURCES_PATH, ...paths);
};

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1280,
    height: 720,
    icon: getAssetPath('icon.ico'),
    autoHideMenuBar: true,
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.on('close', (e) => {
    if (!isDebug) {
      e.preventDefault();
      mainWindow?.webContents.send('app-close');
    }
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  if (process.platform === 'win32') {
    app.setAppUserModelId('Fotoluks Manager');
  }

  //mainWindow.webContents.openDevTools();
};

const showNotification = (title: string, body: string) => {
  const options = {
    title,
    body,
    icon: getAssetPath('icon.ico'),
  };

  new Notification(options).show();
};

ipcMain.on('check-update-pending', (event) => {
  const { sender } = event;

  if (isDebug) {
    sender.send('check-update-success');
  } else {
    const result = autoUpdater.checkForUpdates();
    result
      .then((checkResult) => {
        sender.send('check-update-success', checkResult?.updateInfo);
      })
      .catch(() => {
        sender.send('check-update-failure');
      });
  }
});

ipcMain.on('download-update-pending', (event) => {
  const { sender } = event;

  const result = autoUpdater.downloadUpdate();
  result
    .then(() => {
      sender.send('download-update-success');
    })
    .catch(() => {
      sender.send('download-update-failure');
    });
});

autoUpdater.on('download-progress', () => {});
ipcMain.on('download-update-progress', (event) => {
  const { sender } = event;

  autoUpdater.signals.progress((info) => {
    sender.send('download-update-progress', info.percent);
  });
});

ipcMain.on('quit-and-install-update', () => {
  autoUpdater.quitAndInstall(true, true);
});

ipcMain.on('show-notification', async (_event, args) => {
  const title = args[0];
  const text = args[1];

  showNotification(title, text);
});

ipcMain.on('select-directory', async (event, args) => {
  if (!mainWindow) return;
  const defaultPath = args[0];
  dialog
    .showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      defaultPath,
    })
    .then((data) => {
      event.reply('select-directory', [data.filePaths]);
    });
});

ipcMain.on('open-folder', async (_event, args) => {
  const folderPath = args[0];

  shell.openPath(folderPath);
});

ipcMain.on('maximize', async (_event, _args) => {
  mainWindow?.maximize();
});

ipcMain.on(
  'get-files-for-upload',
  async (event, filePathsForUpload: IFilePathForUpload[]) => {
    const filesForUpload: IFileForUpload[] = [];
    for (const filePathForUpload of filePathsForUpload) {
      const targetId = filePathForUpload.targetId;
      const filename = path.parse(filePathForUpload.filePath).base;
      const file = await fspromises.readFile(filePathForUpload.filePath);
      filesForUpload.push({ targetId, filename, file });
    }
    event.reply('get-files-for-upload', filesForUpload);
  }
);

ipcMain.on('download-file', async (_event, url: string) => {
  if (!mainWindow) return;
  try {
    mainWindow.webContents.downloadURL(url);
  } catch (error) {
    mainWindow?.webContents.send('download-file-error', url);
  }
});

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
