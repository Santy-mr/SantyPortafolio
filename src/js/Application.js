import * as THREE from 'three'
import Sizes from '../utils/Sizes.js'
import Time from '../utils/Time.js'
import Debug from '../utils/Debug.js'
import Camera from './Camera.js'
import Sources from './Sources.js'
import Renderer from './Renderer.js'
import Resources from '../utils/Resources.js'
import World from './World.js'

let instance = null

export default class Application {
    constructor(canvas) {
        if (instance) { return instance }
        instance = this

        this.canvas = canvas
        
        this.sizes = new Sizes()
        this.time = new Time()
        this.debug = new Debug();

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
        this.world.Update();
        this.camera.Update();
    }

    Destroy(){
        this.sizes.off('resize')
        this.time.off('animate')

        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh){
                child.geometry.dispose()

                for(const key in child.material){
                    const value = child.material[key]

                    if(value && typeof value.dispose === 'function')
                    {
                        value.dispose()
                    }
                }
            }
        })
        this.renderer.instance.dispose()

        if(this.debug.active){
            this.debug.ui.destroy()
        }
    }
}
