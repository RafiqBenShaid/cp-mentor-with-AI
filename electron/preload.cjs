const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('cpMentor', {
  isDesktop: true,
  platform: process.platform,
  notify: (title, body, silent = false) =>
    ipcRenderer.invoke('cp-mentor:notify', { title, body, silent }),
  getVersion: () => ipcRenderer.invoke('cp-mentor:version'),
})
