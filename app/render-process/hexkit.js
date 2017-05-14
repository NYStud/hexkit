import Workspace from './Workspace';
import Settings from './Settings';
import CommandRegistry from './CommandRegistry';
import StatusBar from './StatusBar';
import TabBar from './TabBar';

if(global.hexkit === null || global.hexkit === undefined) {
    class hexkit {

        constructor() {
            this._workspace = new Workspace();
            this._settings = new Settings();
            this._commandRegistry = new CommandRegistry();
            this._statusBar = new StatusBar();
            this._tabBar = new TabBar();
        }

        get workspace() {
            return this._workspace;
        }

        get settings() {
            return this._settings;
        }

        get commandRegistry() {
            return this._commandRegistry;
        }

        get hexEditorRegistry() {
            return this.workspace.hexEditorRegistry;
        }

        get statusBar() {
            return this._statusBar;
        }

        get tabBar() {
            return this._tabBar;
        }

        startup() {

        }

        shutdown() {

        }
    }

    global.hexkit = new hexkit(); // jshint ignore:line
}

export default global.hexkit;
