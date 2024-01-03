import { app, BrowserWindow, ipcMain } from "electron";
import Clipboard from "./eve/clipboard";
import Zkillboard from "./eve/zkillboard";
import * as path from "path";
import SqliteService from "./service/sqliteService";

let mainWindow: BrowserWindow | null;
let clipboard: Clipboard;

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 400,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
        width: 300,
    });

    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../index.html"));

    mainWindow.on("closed", () => {
        app.quit();
    });

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    initIpc();
    mainWindow = createWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

function initIpc() {
    ipcMain.handle('ping', () => 'server started')

    ipcMain.on('checkName', (event, arg) => {
        if (arg) {
            console.log('start');
            clipboard.start();
        } else {
            console.log('stop');
            clipboard.stop();
        }
    })

}

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

async function main() {
    await SqliteService.init('evetool.sqlite');

    const zkillboard = new Zkillboard();
    clipboard = new Clipboard(200, async (name) => {
        mainWindow.webContents.send('clipboard', name);
        const character = await SqliteService.getCharacter(name);
        let id
        if (!character) {
            try {
                id = await zkillboard.getCharacterId(name);
                SqliteService.addInsertTask(name, id);
            } catch (e) {
                console.log(e);
                return;
            }
        } else {
            id = character.id;
        }
        let url = zkillboard.getCharacterUrlById(id);
        if (url) openCharacterWindow(url);
    }).start();

    let characterWindow: BrowserWindow;

    function openCharacterWindow(url: string) {
        if (!characterWindow) {
            characterWindow = new BrowserWindow({
                height: 800,
                width: 1300,
            });
            characterWindow.on("closed", () => {
                characterWindow = null;
            });
        }
        characterWindow.loadURL(url);
        characterWindow.show();
    }
}


main();
