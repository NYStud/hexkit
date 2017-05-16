'use strict';

import {ipcRenderer} from 'electron';

export default class CommandRegistry {

    constructor() {
        this.commands = {};
        let self = this;
        ipcRenderer.on('command', function(sender, cmd) {
            if(cmd in self.commands) {
                self.commands[cmd]();
            } else {
                console.log(cmd);
            }
        });
    }

    add(command, handler) {
        this.commands[command] = handler;
    }
}
