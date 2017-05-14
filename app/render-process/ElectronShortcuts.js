import {ipcRenderer} from 'electron';

export default class ElectronShortcuts {
    constructor() {
        this.keys = {};
        this.listen();
    }

    register(key, handler) {
        this.keys[key] = handler;
        ipcRenderer.send('globalShortcut-register', key);
    }

    unregister(key) {
        this.keys[key] = null;
        ipcRenderer.send('globalShortcut-unregister', key);
    }

    unregisterAll() {
        this.keys = {};
        ipcRenderer.send('globalShortcut-unregister-all');
    }

    listen() {
        let self = this;
        ipcRenderer.on('globalShortcut', function(sender, key){
            self.keys[key]();
        });
    }

}
