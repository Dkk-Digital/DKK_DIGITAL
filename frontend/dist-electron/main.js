import { BrowserWindow as e, app as t } from "electron";
import n from "path";
import { fileURLToPath as r } from "url";
//#region electron/main.js
var i = r(import.meta.url), a = n.dirname(i), o;
function s() {
	o = new e({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: n.join(a, "preload.js"),
			nodeIntegration: !0,
			contextIsolation: !1
		}
	}), process.env.VITE_DEV_SERVER_URL ? o.loadURL(process.env.VITE_DEV_SERVER_URL) : o.loadFile(n.join(a, "../dist/index.html")), o.on("closed", () => {
		o = null;
	});
}
t.whenReady().then(() => {
	s(), t.on("activate", () => {
		e.getAllWindows().length === 0 && s();
	});
}), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
});
//#endregion
