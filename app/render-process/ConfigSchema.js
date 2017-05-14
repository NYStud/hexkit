// This is loaded by atom-environment.coffee. See
// https://atom.io/docs/api/latest/Config for more information about config
// schemas.
const configSchema = {
    core: {
        type: 'object',
        themes: {
            type: 'array',
            default: ['one-dark-ui', 'one-dark-syntax'],
            items: {
                type: 'string'
            },
            description: 'Names of UI and syntax themes which will be used when Atom starts.'
        },
        audioBeep: {
            type: 'boolean',
            default: true,
            description: 'Trigger the system\'s beep sound when certain actions cannot be executed or there are no results.'
        },
        closeDeletedFileTabs: {
            type: 'boolean',
            default: false,
            title: 'Close Deleted File Tabs',
            description: 'Close corresponding editors when a file is deleted outside Atom.'
        },
        destroyEmptyPanes: {
            type: 'boolean',
            default: true,
            title: 'Remove Empty Panes',
            description: 'When the last tab of a pane is closed, remove that pane as well.'
        },
        closeEmptyWindows: {
            type: 'boolean',
            default: true,
            description: 'When a window with no open tabs or panes is given the \'Close Tab\' command, close that window.'
        },
        openEmptyEditorOnStart: {
            description: 'When checked opens an untitled editor when loading a blank environment (such as with _File > New Window_ or when "Restore Previous Windows On Start" is unchecked); otherwise no editor is opened when loading a blank environment. This setting has no effect when restoring a previous state.',
            type: 'boolean',
            default: true
        },
        restorePreviousWindowsOnStart: {
            description: 'When checked restores the last state of all Atom windows when started from the icon or `atom` by itself from the command line; otherwise a blank environment is loaded.',
            type: 'boolean',
            default: true
        },
    },
    editor: {
        type: 'object'
    }
};

if (['win32', 'linux'].includes(process.platform)) {
    configSchema.core.properties.autoHideMenuBar = {
        type: 'boolean',
        default: false,
        description: 'Automatically hide the menu bar and toggle it by pressing Alt. This is only supported on Windows & Linux.'
    };
}

if (process.platform === 'darwin') {
    configSchema.core.properties.titleBar = {
        type: 'string',
        default: 'native',
        enum: ['native', 'custom', 'custom-inset', 'hidden'],
        description: 'Experimental: A `custom` title bar adapts to theme colors. Choosing `custom-inset` adds a bit more padding. The title bar can also be completely `hidden`.<br>Note: Switching to a custom or hidden title bar will compromise some functionality.<br>This setting will require a relaunch of Atom to take effect.'
    };
}

module.exports = configSchema;
