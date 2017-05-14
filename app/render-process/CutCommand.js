import CommandRegistry from './CommandRegistry';

export default class CutCommand {

    register() {
        CommandRegistry.add('cut', this.cutHandler.bind(this));
    }

    cutHandler() {

    }

}
