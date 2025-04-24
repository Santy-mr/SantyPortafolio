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
    
        this.SetTexture();
        this.SetModel();
    }

    SetTexture(){
        this.mainTexture = this.resources.items.mainTexture
        this.mainTexture.colorSpace = THREE.SRGBColorSpace
        this.mainTexture.needsUpdate = true
        this.mainTexture.generateMipmaps = false
        this.mainTexture.minFilter = THREE.NearestFilter
        this.mainTexture.magFilter = THREE.NearestFilter
        this.mainTexture.flipY = false
    }

    SetModel(){
        this.model = this.resource.scene
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh && child.material){
                child.material.map = this.mainTexture
            }
        });
    }
}