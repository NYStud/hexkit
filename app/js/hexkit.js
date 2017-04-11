import Workspace from './Workspace';
import Settings from './Settings';
import CommandRegistry from './CommandRegistry';

if(global.hexkit === null || global.hexkit === undefined) {
    class hexkit {

        constructor() {
            this._workspace = new Workspace();
            this._settings = new Settings();
            this._commandRegistry = new CommandRegistry();
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

        startup() {

        }

        shutdown() {

        }
    }

    global.hexkit = new hexkit();
}

export default global.hexkit;
