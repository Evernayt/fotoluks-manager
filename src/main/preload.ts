// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'show-notification'
  | 'select-directory'
  | 'open-folder'
  | 'maximize'
  | 'check-update-pending'
  | 'check-update-success'
  | 'check-update-failure'
  | 'download-update-pending'
  | 'download-update-success'
  | 'download-update-failure'
  | 'download-update-progress'
  | 'quit-and-install-update'
  | 'app-close'
  | 'get-files-for-upload'
  | 'download-file'
  | 'download-file-completed'
  | 'download-file-cancel'
  | 'download-file-error';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, args: any) {
      ipcRenderer.send(channel, args);
    },
    on(channel: Channels, func: (...args: any[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: any[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
    removeAllListeners(channel: Channels) {
      ipcRenderer.removeAllListeners(channel);
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
