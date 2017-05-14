let instance = null;

export default class Platform {
    constructor() {
        this.isWin = /^win/.test(process.platform);
        this.isMac = /^darwin/.test(process.platform);
        this.isLinux = /^linux/.test(process.platform);
    }

    static getInstance() {
        if(instance === null) {
            instance = new Platform();
        }
        return instance;
    }
}
