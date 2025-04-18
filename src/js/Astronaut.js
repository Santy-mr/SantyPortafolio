import Application from "./Application.js";
import * as THREE from 'three'

export default class Astronaut {
    constructor() {
        this.application = new Application()

        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time

        this.resource = this.resources.items.astronautModel

        this.SetModels();
        this.SetAnimation();
    }

    SetModels() {
        this.model = this.resource.scene
        this.scene.add(this.model)

        this.model.traverse((child) => {
            if (child instanceof THREE.Mesh) {   
                child.material.map.colorSpace = THREE.SRGBColorSpace;
                child.material.map.minFilter = THREE.NearestFilter;
                child.material.map.magFilter = THREE.NearestFilter;
                child.material.normalMap.minFilter = THREE.NearestFilter;
                child.material.normalMap.magFilter = THREE.NearestFilter;
            }
        })
    }

    SetAnimation(){
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        this.animation.actions = {
            salute: this.animation.mixer.clipAction(this.resource.animations[0])
        }
    }

    Update(){
        this.animation.mixer.update(this.time.delta * 0.0005)
    }
}