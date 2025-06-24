import * as THREE from 'three'
import Sizes from '../../utils/Sizes.js'
import Time from '../../utils/Time.js'
import Debug from '../../utils/Debug.js'
import Camera from '../rendering/Camera.js'
import Sources from '../resources/Sources.js'
import Renderer from '../rendering/Renderer.js'
import Resources from '../../utils/Resources.js'
import World from './World.js'
import LoadingScreen from '../ui/LoadingScreen.js'
import Animations from '../controls/Animations.js'

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
        this.loadingScreen = new LoadingScreen(this);
        this.camera = new Camera(this);
        this.renderer = new Renderer(this)
        this.animations = new Animations();

        this.world = new World(this);

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
