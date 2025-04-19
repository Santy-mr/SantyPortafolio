
import Model from './Models.js';
import * as THREE from 'three'

export default class Astronaut extends Model{
    constructor() {
        super("astronautModel")

        this.speedAstronautAnim = 0.0005

        this.SetAnimation();
    }

    SetAnimation(){
        this.animation = {}
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        this.animation.actions = {
            salute: this.animation.mixer.clipAction(this.resource.animations[0])
        }
    }

    Update(){
        this.animation.mixer.update(this.time.delta * this.speedAstronautAnim)
    }
}