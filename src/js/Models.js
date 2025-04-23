import Application from "./Application.js";
import * as THREE from "three"

export default class Model {
    constructor(modelName){
        this.application = new Application()

        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time

        this.resourceName = modelName
        this.resource = this.resources.items[this.resourceName]

        this.SetModel()
    }

    SetModel(){
        this.model = this.resource.scene
        this.scene.add(this.model)
    }
}