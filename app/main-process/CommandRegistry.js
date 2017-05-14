import {BrowserWindow} from 'electron';

let commands = [];

export default class CommandRegistry {
    constructor() {
    }

    static add(command, handler) {
        commands[command] = handler;
    }

    static remove(command) {
        delete command[command];
    }

    static dispatch(command) {
        command[command]();
    }

    static command(cmd) {
        if(cmd in commands) {
            commands[cmd]();
        } else {
            if(BrowserWindow.getFocusedWindow() !== null)
            {
                BrowserWindow.getFocusedWindow().webContents.send('command', cmd);
            }
        }
    }
}
