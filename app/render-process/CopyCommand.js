import CommandRegistry from './CommandRegistry';

export default class CopyCommand {
    register() {
        CommandRegistry.add('copy', this.copyHandler.bind(this));
    }

    copyHandler() {

    }
}
