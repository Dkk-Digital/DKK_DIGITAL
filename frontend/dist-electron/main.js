//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), { app: t, BrowserWindow: n } = e("electron"), r = e("path"), i;
function a() {
	i = new n({
		width: 1200,
		height: 800,
		webPreferences: {
			preload: r.join(__dirname, "preload.js"),
			nodeIntegration: !0,
			contextIsolation: !1
		}
	}), process.env.VITE_DEV_SERVER_URL ? i.loadURL(process.env.VITE_DEV_SERVER_URL) : i.loadFile(r.join(__dirname, "../dist/index.html")), i.on("closed", () => {
		i = null;
	});
}
t.whenReady().then(() => {
	a(), t.on("activate", () => {
		n.getAllWindows().length === 0 && a();
	});
}), t.on("window-all-closed", () => {
	process.platform !== "darwin" && t.quit();
});
//#endregion
