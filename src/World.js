import Application from "./Application.js"

export default class World {
    constructor(){
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources

        this.resources.on('loaded', () => {
            
        })
    }
}