
import Model from './Models.js';
import * as THREE from 'three'

export default class Astronaut extends Model {
    constructor() {
        super("astronautModel")

        this.speedAstronautAnim = 0.0005
        this.texture = this.resources.items.mainTexture
        this.texture.colorSpace = THREE.SRGBColorSpace
        this.texture.generateMipmaps = false;
        this.texture.minFilter = THREE.NearestFilter
        this.texture.magFilter = THREE.NearestFilter


        this.SetTexture();
        // this.SetAnimation();
    }

    SetTexture(){
        this.material = new THREE.MeshStandardMaterial({
            map: this.texture
        })
        
        this.model.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.material = this.material
            }
        })
    }

    SetAnimation() {
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        this.animation.actions = {
            salute: this.animation.mixer.clipAction(this.resource.animations[0])
        }
    }

    Update() {
        this.model.rotation.y += this.time.delta * 0.0005

        // this.animation.mixer.update(this.time.delta * this.speedAstronautAnim)
    }
}