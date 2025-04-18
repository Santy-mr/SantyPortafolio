import Application from "./Application.js";

export default class Planets {
    constructor(){
        this.application = new Application()

        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time

        this.resource = this.resources.items.planetModel

        this.SetModels();
    }

    SetModels() {
        this.model = this.resource.scene
        this.scene.add(this.model)
    }

    Update() {
        this.model.rotation.y += this.time.delta * 0.0001
    }
}