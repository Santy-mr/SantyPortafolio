import * as THREE from 'three'
import Camera from './Camera'

let instance = null

export default class Application {
    constructor(canvas) {
        if (instance) { return instance }
        instance = this

        this.canvas = canvas
        this.camera = new Camera();
    }
}
