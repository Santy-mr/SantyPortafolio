import * as THREE from 'three'
import Sizes from '../static/utils/Sizes.js'
import Time from '../static/utils/Time.js'
import Camera from './Camera.js'
import Sources from './Sources.js'
import Renderer from './Renderer.js'
import Resources from '../static/utils/Resources.js'
import World from './World.js'

let instance = null

export default class Application {
    constructor(canvas) {
        if (instance) { return instance }
        instance = this

        this.canvas = canvas
        
        this.sizes = new Sizes()
        this.time = new Time()
        this.scene = new THREE.Scene();
        this.resources = new Resources(Sources)
        this.camera = new Camera();
        this.renderer = new Renderer()
        this.world = new World()

        this.sizes.on('resize', () => {
            this.Resize();
        })

        this.time.on('animate', () => {
            this.Update();
        })
    }

    Resize(){
        this.camera.Resize();
        this.renderer.Resize();
    }

    Update(){
        this.renderer.Update();
    }
}
