import Platform from './Platform';
import Paths from './Paths';
import path from 'path';
import {Menu} from 'electron';
import CommandRegistry from './CommandRegistry';

export default class Menus {
    constructor() {
        this.applyApplicationMenus();
    }

    makeClickHandler(cmd) {
        return function() {
            CommandRegistry.command(cmd);
        };
    }

    makeMenuTemplate(src) {
        let template = [];
        for(let i = 0; i < src.length; i++) {
            let menu = {};
            menu.label = src[i].label;
            if(src[i].type !== null && src[i].type !== undefined) {
                menu.type = src[i].type;
            }
            menu.click = this.makeClickHandler(src[i].command);
            if(src[i].submenu !== null && src[i].submenu !== undefined) {
                menu.submenu = this.makeMenuTemplate(src[i].submenu);
            }
            template.push(menu);
        }
        return template;
    }

    applyApplicationMenus() {
        let menuTemplate = null;
        if(Platform.getInstance().isWin) {
            menuTemplate = require(path.join(path.join(Paths.rootDir(), 'menus'), 'windows.json'));
        } else if(Platform.getInstance().isMac) {
            menuTemplate = require(path.join(path.join(Paths.rootDir(), 'menus'), 'mac.json'));
        } else if(Platform.getInstance().isLinux) {
            menuTemplate = require(path.join(path.join(Paths.rootDir(), 'menus'), 'linux.json'));
        }
        const menu = Menu.buildFromTemplate(this.makeMenuTemplate(menuTemplate.menu));
        Menu.setApplicationMenu(menu);
    }
}
