'use strict';

import './RequireHook';
import HexEditorComponent from './HexEditorComponent';
import StatusBarComponent from './StatusBarComponent';
import TabBarComponent from './TabBarComponent';
import hexkit from 'hexkit';
import OpenCommand from './OpenCommand';
import CloseCommand from './CloseCommand';
import StatusBarOffsetPanel from './StatusBarOffsetPanel';
import StatusBarSelectionPanel from './StatusBarSelectionPanel';

window.onload = function() {
    hexkit.startup();

    new TabBarComponent();
    new HexEditorComponent();
    new StatusBarComponent();
    new StatusBarOffsetPanel();
    new StatusBarSelectionPanel();
    new OpenCommand();
    new CloseCommand();
};

function shutdown() {
    hexkit.shutdown();
}
