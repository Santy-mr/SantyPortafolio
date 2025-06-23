import * as THREE from 'three'
import Application from './Application.js'

export default class Renderer {
    constructor(application){
        this.application = application

        this.canvas = this.application.canvas
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.camera = this.application.camera
        this.pixelRatio = this.application.pixelRatio

        this.SetInstance();
    }

    SetInstance(){
        this.instance = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true })
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    Resize(){
        this.instance.setSize(this.sizes.width, this.sizes.height)
        this.instance.setPixelRatio(this.sizes.pixelRatio)
    }

    Update(){
        this.instance.render(this.scene, this.camera.instance)
    }
}