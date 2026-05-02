//#region electron/preload.js
require("electron").contextBridge.exposeInMainWorld("electron", {});
//#endregion
