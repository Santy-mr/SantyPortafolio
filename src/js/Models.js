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

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material && child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
                child.material.map.minFilter = THREE.NearestFilter;
                child.material.map.magFilter = THREE.NearestFilter;
                
                if (child.material.normalMap) {
                    child.material.normalMap.minFilter = THREE.NearestFilter;
                    child.material.normalMap.magFilter = THREE.NearestFilter;
                }
            }
        });
    }
}