import * as THREE from 'three';
import Application from './Application.js';

export default class Camera {
    constructor(){
        this.application = new Application();
        
        this.sizes = this.application.sizes
        this.scene = this.application.scene
    }

    SetInstance(){
        this.camera = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.camera.position.set(0, 0, 6)
        this.scene.add(this.camera)
    }

    Resize(){
        this.camera.aspect = this.sizes.width / this.sizes.height
        this.camera.updateProjectionMatrix();
    }
}