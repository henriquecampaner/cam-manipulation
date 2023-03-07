export default class Controller {
  private worker: any
  private blinkCounter = 0
  constructor({ worker }: any) {
    this.worker = this.configureWorker(worker)
  }

  static async initialize(deps: any) {
    const controller = new Controller(deps)
    return controller.init()
  }

  private async configureWorker(worker: any) {
    const blinked = await worker.getBlinked()
    this.blinkCounter += blinked
  }

  async init() {
    // console.log('XDxx')
  }
}
