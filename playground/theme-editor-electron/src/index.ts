import { app, BrowserView, BrowserWindow, ipcMain, dialog } from "electron";
const fs = require("fs");
// This allows TypeScript to pick up the magic constant that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: any;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  // eslint-disable-line global-require
  app.quit();
}

const createWindow = (): void => {
  // Create the browser window.

  const mainWindow = new BrowserWindow({
    height: 600,
    width: 800,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      nodeIntegrationInSubFrames: true,
      nativeWindowOpen: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  ipcMain.on("window-close", (event, { id }) => {
    const targetWindow = windowByTitle(id);
    if (targetWindow) {
      let childWindows = BrowserWindow.getAllWindows();
      console.log(`before close we have ${childWindows.length} windows`);

      console.log(`close this window`);
      targetWindow.destroy();
      childWindows = BrowserWindow.getAllWindows();
      console.log(`after close we have ${childWindows.length} windows`);
    }
  });
  mainWindow.webContents.setWindowOpenHandler(
    ({ url, frameName, features, ...rest }) => {
      console.log(`setWindowOpenHandler '${frameName}'`, { features, rest });

      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          show: false,
          frame: false,
          parent: mainWindow,
          roundedCorners: false,
          focusable: false,
          transparent: true,
        },

        webPreferences: {
          preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
      };
    }
  );

  ipcMain.on("window-resize", (event, arg) => {
    console.log(`window resize ${arg.width}`);
    mainWindow.setSize(arg.width, arg.height);
  });

  const windowByTitle = (title: string) =>
    BrowserWindow.getAllWindows().find((w) => w.title === title);

  ipcMain.on("window-size", (event, { id, height, width }) => {
    const targetWindow = windowByTitle(id);
    if (targetWindow) {
      targetWindow.setContentSize(width, height);
    }
  });

  ipcMain.on("window-position", (event, { id, left, top }) => {
    const mainWindow = windowByTitle("Toolkit Test App");
    const mainBounds = mainWindow!.getContentBounds();
    const targetWindow = windowByTitle(id);

    const targetX = parseInt(left + mainBounds.x);
    const targetY = parseInt(top + mainBounds.y);

    try {
      targetWindow!.setPosition(targetX, targetY);
    } catch (e) {
      console.log(`error setting position`, e);
    }
  });

  ipcMain.on("window-ready", (event, { id }) => {
    const targetWindow = windowByTitle(id);

    setTimeout(() => {
      if (targetWindow) targetWindow.showInactive();
    }, 50);
  });

  mainWindow.webContents.openDevTools({ mode: "detach" });

  ///////// Theme editor specific content

  const view = new BrowserView();
  mainWindow.setBrowserView(view);
  view.setBounds({
    x: 240,
    y: 44,
    width: mainWindow.getContentBounds().width - 240,
    height: mainWindow.getContentBounds().height - 44,
  });
  view.setAutoResize({ width: true, height: true });
  view.webContents.loadURL("http://localhost:3005");
  view.webContents.openDevTools({ mode: "detach" });

  ipcMain.on("update-styles", (event, styles) => {
    view.webContents.executeJavaScript(`
      document.head.append(document.createElement('style'));
      document.head.lastChild.innerText = ${styles}
    `);
  });

  ipcMain.on("change-mode", (event, mode) => {
    var currentMode = mode === "light" ? "dark" : "light";
    view.webContents.executeJavaScript(`
      var themeWrapper = document.getElementsByTagName('uitk-theme')[0];
      var currentClassNames = themeWrapper.className;
      themeWrapper.className = currentClassNames.replace('${currentMode}', '${mode}');
    `);
  });

  ipcMain.on("update-view-url", (event, url) => {
    view.webContents.loadURL(url);
  });

  ipcMain.on("save-styles", async (event, cssByPattern) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    const dirName = result.filePaths[0];

    UITK_FOUNDATIONS.forEach(
      async (foundation) =>
        await fs.writeFileSync(
          dirName + `/index.css`,
          `@import url(foundations/${foundation}.css);\n`,
          { flag: "a" }
        )
    );
    UITK_CHARACTERISTICS.forEach(
      async (characteristic) =>
        await fs.writeFileSync(
          dirName + `/index.css`,
          `@import url(characteristics/${characteristic}.css);\n`,
          { flag: "a" }
        )
    );

    fs.mkdir(dirName + `/characteristics`, (err: unknown) => console.log(err));
    fs.mkdir(dirName + `/foundations`, (err: unknown) => console.log(err));

    try {
      for (var element of cssByPattern) {
        var patternName = element.pattern;
        var cssString = element.cssObj;
        var patternType = UITK_CHARACTERISTICS.includes(patternName)
          ? "characteristics"
          : "foundations";
        fs.writeFileSync(
          dirName + `/${patternType}/${patternName}.css`,
          cssString.replaceAll("\n", "")
        );
      }
    } catch (err) {
      console.log(err);
    }
  });

  ipcMain.handle("get-browser-view-theme", async (event, arg) => {
    var browserViewTheme;
    await view.webContents
      .executeJavaScript(
        `
      function getClassNames() {
        var themeWrapper = document.getElementsByTagName('uitk-theme')[0];
        return themeWrapper.className;
      }
      getClassNames();
  `
      )
      .then((result) => {
        {
          browserViewTheme = result;
        }
      })
      .catch((err) => console.log(err));
    return browserViewTheme;
  });

  ipcMain.handle("select-dir", async (event, arg) => {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    });

    const dirName = result.filePaths[0];

    try {
      const theme = await fs.promises
        .readdir(dirName)
        .then(async (files: string) => {
          let themeContents = "";
          for (const file of files) {
            if (file === "index.css") {
              var indexContents = fs.readFileSync(dirName + "/" + file, "utf8");
              themeContents += await recurseDirectory(dirName, indexContents);
            }
          }
          return themeContents;
        });

      return [theme, dirName.split("/").slice(-1)[0]];
    } catch (error) {
      console.log(error);
    }
  });
};

var UITK_CHARACTERISTICS = [
  "accent",
  "actionable",
  "container",
  "delay",
  "disabled",
  "draggable",
  "droptarget",
  "editable",
  "focused",
  "measured",
  "navigable",
  "overlayable",
  "ratable",
  "selectable",
  "separable",
  "status",
  "taggable",
  "text",
];

var UITK_FOUNDATIONS = [
  "color",
  "fade",
  "icon",
  "shadow",
  "size",
  "spacing",
  "typography",
  "zindex",
];

async function recurseDirectory(dirName: string, fileContents: string) {
  let allContents = "";

  for (var line of fileContents.split("\n")) {
    if (line.startsWith("@import")) {
      var importURL = /\(\s*([^)]+?)\s*\)/.exec(line);

      if (importURL) {
        var url = importURL[1];
        var importedContents = fs.readFileSync(dirName + "/" + url, "utf8");
        if (
          UITK_CHARACTERISTICS.concat(UITK_FOUNDATIONS).indexOf(
            url.split("/")[1].replace(".css", "")
          ) !== -1
        ) {
          allContents += importedContents;
        } else {
          var subDirName = dirName + "/" + url.split("/")[0];
          allContents += await recurseDirectory(subDirName, importedContents);
        }
      }
    } else {
      continue;
    }
  }

  return allContents;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
