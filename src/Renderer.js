import * as THREE from 'three'
import Application from './Application.js'

export default class Renderer {
    constructor(){
        this.application = new Application()

        this.canvas = this.application.canvas
        this.sizes = this.application.sizes
        this.scene = this.application.render
        this.camera = this.application.camera

        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, alpha: true })
    }

    Resize(){
        this.renderer.setSize(this.sizes.width, this.sizes.height)
    }

    Update(){
        this.renderer.render(this.scene, this.camera)
    }
}