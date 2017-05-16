'use strict';
import electron from 'electron';

// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;
import Menus from './Menus';

const path = require('path');
const url = require('url');

import CommandRegistry from './CommandRegistry';

let windows = [];
let lastBlur = null;

function onWindowClosed(win) {
    let index = windows.indexOf(win);
    if(index >= 0) {
        windows.splice(index, 0);
    }
}

function onWindowBlur(win) {
    lastBlur = win;
}

function licenseWindow() {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 400,
        height: 300
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../license.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function aboutWindow() {
    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: 400,
        height: 300
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../about.html'),
        protocol: 'file:',
        slashes: true
    }));
}

function createWindow() {

    //get nearest display to cursor
    let display = electron.screen.getDisplayNearestPoint(electron.screen.getCursorScreenPoint());
    let width = 1000;
    let height = 750;
    let x = display.bounds.x + 100;
    let y = display.bounds.y + 100;

    // Create the browser window.
    let mainWindow = new BrowserWindow({
        width: width,
        height: height,
        x: x,
        y: y
    });

    // and load the index.html of the app.
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, '../main.html'),
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    //mainWindow.webContents.openDevTools();

    let fn = onWindowClosed.bind(null, mainWindow);
    let fn2 = onWindowBlur.bind(null, mainWindow);

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
        fn();
    });

    mainWindow.on('blur', function() {
        fn2();
    });

    return mainWindow;
}

CommandRegistry.add('application:quit', function() {
    app.quit();
});

CommandRegistry.add('application:unhide-all-applications', function() {
    windows.forEach(win => {
        win.restore();
    });
});

CommandRegistry.add('window:toggle-dev-tools', function() {
    windows.forEach(win => {
        win.webContents.openDevTools();
    });
});

CommandRegistry.add('application:new-window', function() {
    windows.push(createWindow());
});

CommandRegistry.add('application:about', function() {
    aboutWindow();
});

CommandRegistry.add('application:open-license', function() {
    licenseWindow();
});

CommandRegistry.add('application:hide', function() {
    windows.forEach(win => {
        win.hide();
    });
});

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.






function onReady() {
    new Menus();
    windows.push(createWindow());
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', onReady);

// Quit when all windows are closed.
app.on('window-all-closed', function() {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (windows.length === 0) {
        windows.push(createWindow());
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
