'use strict';

import HTMLElement from './HTMLElement';
import HexEditorComponent from './HexEditorComponent';
import HexEditor from './HexEditor';
import WebFile from './WebFile';
import StatusBarComponent from './StatusBarComponent';
import StatusBar from './StatusBar';
import StatusBarPanel from './StatusBarPanel';
import HexUtils from './HexUtils';
import TabBarComponent from './TabBarComponent';
import MenuBarComponent from './MenuBarComponent';
import MenuBar from './MenuBar';
import MenuItem from './MenuItem';
import Menu from './Menu';
import hexkit from './hexkit';
import TabBar from './TabBar';
import Tab from './Tab';
import Platform from './Platform';
import NativeFile from './NativeFile';
import path from 'path';
import WritableBinaryBuffer from './binarybuffer/WritableBinaryBuffer';
import TitleBarElement from './TitleBarElement';
import WebShortcuts from './WebShortcuts';

let dialog;

new WebShortcuts();

if(Platform.isElectron()) {
    dialog = require('electron').remote.dialog;
}

window.onload = function() {
    hexkit.startup();

    let parent = new HTMLElement(document.body);

    let titleBarElement = new TitleBarElement();
    titleBarElement.appendTo(parent);

    let menuBar = new MenuBar();
    new MenuBarComponent(parent, menuBar);

    let tabBar = new TabBar();
    new TabBarComponent(parent, tabBar);
    //tabBar.addTab(new Tab(tabBar, 'hello1'));
    //tabBar.addTab(new Tab(tabBar, 'hello2'));
    //tabBar.addTab(new Tab(tabBar, 'hello3'));
    //tabBar.addTab(new Tab(tabBar, 'hello4'));
    //tabBar.addTab(new Tab(tabBar, 'hello5'));
    let hexEditorComponent = new HexEditorComponent(parent);
    let statusbarComponent = new StatusBarComponent(parent);
    let statusbar = new StatusBar();
    statusbarComponent.setStatusBar(statusbar);
    let statusBarPanel1 = new StatusBarPanel();
    statusbar.addPanel(statusBarPanel1);
    statusBarPanel1.text = 'Offset: 0';
    let statusBarPanel2 = new StatusBarPanel();
    statusbar.addPanel(statusBarPanel2);
    statusBarPanel2.text = 'Selection: none';

    let fileSubMenu = new Menu();
    fileSubMenu.appendMenuItem(new MenuItem(false, 'File Sub 1', null));
    fileSubMenu.appendMenuItem(new MenuItem(false, 'File Sub 2', null));
    fileSubMenu.appendMenuItem(new MenuItem(false, 'File Sub 3', null));
    fileSubMenu.appendMenuItem(new MenuItem(false, 'File Sub 4', null));

    let fileSubMenu2 = new Menu();
    fileSubMenu2.appendMenuItem(new MenuItem(false, 'File Sub2 1', null));
    fileSubMenu2.appendMenuItem(new MenuItem(false, 'File Sub2 2', null));
    fileSubMenu2.appendMenuItem(new MenuItem(false, 'File Sub2 3', fileSubMenu));
    fileSubMenu2.appendMenuItem(new MenuItem(false, 'File Sub2 4', null));

    let fileSubMenu21 = new Menu();
    fileSubMenu21.appendMenuItem(new MenuItem(false, 'File Sub21 1', null));
    fileSubMenu21.appendMenuItem(new MenuItem(false, 'File Sub21 2', null));
    fileSubMenu21.appendMenuItem(new MenuItem(false, 'File Sub21 3', null));
    fileSubMenu21.appendMenuItem(new MenuItem(false, 'File Sub21 4', null));


    let fileMenu = new Menu();
    let openMenuItem = new MenuItem(false, 'Open', null);
    fileMenu.appendMenuItem(openMenuItem);
    fileMenu.appendMenuItem(new MenuItem(false, 'File 2', fileSubMenu2));
    fileMenu.appendMenuItem(new MenuItem(false, 'File 3', null));
    fileMenu.appendMenuItem(new MenuItem(false, 'File 4', fileSubMenu21));

    let editMenu = new Menu();
    editMenu.appendMenuItem(new MenuItem(false, 'Edit 1', null));
    editMenu.appendMenuItem(new MenuItem(false, 'Edit 2', null));
    editMenu.appendMenuItem(new MenuItem(false, 'Edit 3', null));
    editMenu.appendMenuItem(new MenuItem(false, 'Edit 4', null));

    let commandsMenu = new Menu();
    commandsMenu.appendMenuItem(new MenuItem(false, 'Commands 1', null));
    commandsMenu.appendMenuItem(new MenuItem(false, 'Commands 2', null));
    commandsMenu.appendMenuItem(new MenuItem(false, 'Commands 3', null));
    commandsMenu.appendMenuItem(new MenuItem(false, 'Commands 4', null));

    let helpMenu = new Menu();
    helpMenu.appendMenuItem(new MenuItem(false, 'Help 1', null));
    helpMenu.appendMenuItem(new MenuItem(false, 'Help 2', null));
    helpMenu.appendMenuItem(new MenuItem(false, 'Help 3', null));
    helpMenu.appendMenuItem(new MenuItem(false, 'Help 4', null));

    menuBar.appendMenuItem(new MenuItem(false, 'File', fileMenu));
    menuBar.appendMenuItem(new MenuItem(false, 'Edit', editMenu));
    menuBar.appendMenuItem(new MenuItem(false, 'Commands', commandsMenu));
    menuBar.appendMenuItem(new MenuItem(false, 'Help', helpMenu));

    let _handleOffset = function(offset) {
        statusBarPanel1.text = 'Offset: ' + HexUtils.toHexString(offset);
    };

    let _handleSelection = function(start, end) {
        if(start === -1) {
            statusBarPanel2.text = 'Selection: none';
        } else {
            statusBarPanel2.text = 'Selection: ' + HexUtils.toHexString(start) + ' - ' + HexUtils.toHexString(end);
        }
    };

    let editors = [];

    let _onTabChanged =  function(tab, pos) {
        console.log('onTabChanged + pos ' + pos);
        hexEditorComponent.setEditor(editors[pos]);
    };

    tabBar.onDidChangeActive(_onTabChanged);



    openMenuItem.onAction(function() {
        if(Platform.isElectron()) {
            const files = dialog.showOpenDialog({properties: ['openFile']});
            if(files) {
                console.log('loading file');
                let byteBuffer = new WritableBinaryBuffer(new NativeFile(files[0]));
                let hexEditor = new HexEditor(byteBuffer);
                hexEditor.cursor.onCursorChange(_handleOffset);
                hexEditor.selection.onSelectionChange(_handleSelection);
                //hexEditorComponent.setEditor(hexEditor);
                let index = editors.push(hexEditor) - 1;
                let tab = new Tab(tabBar, path.basename(files[0]));
                tab.onDidClose(function() {
                    editors.splice(index, 1);
                });
                tabBar.addTab(tab);
            }
        } else {
            document.getElementById('files').click();
        }
    });

    //document.getElementById('openFile').onclick = function() {
    //
    //    return true;
    //};

  //  $('#openFile').click(function() {
  //      $('#files').click();
  //      return false;
  //  });

    let handleFileSelect = function(evt) {
        var files = evt.target.files;
        if(files[0] !== undefined) {
            console.log('loading file');
            let byteBuffer = new WritableBinaryBuffer(new WebFile(files[0]));
            let hexEditor = new HexEditor(byteBuffer);
            hexEditor.cursor.onCursorChange(_handleOffset);
            hexEditor.selection.onSelectionChange(_handleSelection);
            editors.push(hexEditor);
            //hexEditorComponent.setEditor(hexEditor);
            tabBar.addTab(new Tab(tabBar, files[0]));

        }
    };
    if(!Platform.isElectron()) {
        document.getElementById('files').addEventListener('change', handleFileSelect, false);
    }
};
