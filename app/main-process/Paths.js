import path from 'path';
import fs from 'fs';

let instance = null;

export default class Paths {
    constructor() {
        this._detectRootDir();
    }

    _detectRootDir() {
        let pathName = __dirname;
        while(!fs.existsSync(path.join(pathName, 'package.json'))) {
            pathName = path.dirname(pathName);
        }
        this.rootDir = pathName;
    }

    static rootDir() {
        return Paths.getInstance().rootDir;
    }

    static getInstance() {
        if(instance === null) {
            instance = new Paths();
        }
        return instance;
    }
}
