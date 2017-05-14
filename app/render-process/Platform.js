export default class Platform {

  static isElectron() {
    if (typeof window !== 'undefined' && window.process && window.process.versions && window.process.versions.electron) {
      return true;
    }
  }
}
