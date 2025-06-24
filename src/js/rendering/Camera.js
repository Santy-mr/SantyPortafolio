import * as THREE from 'three';

export default class Camera {
    constructor(application){
        this.application = application;
        this.sizes = this.application.sizes
        this.scene = this.application.scene
        this.time = this.application.time
        this.canvas = this.application.canvas

        this.minClamp = new THREE.Vector3(-0.24, -0.24, 0)
        this.maxClamp = new THREE.Vector3(0.24, 0.24, 0)

        this.SetInstance();
    }

    SetInstance(){
        this.cameraGroup = new THREE.Group()
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
        this.instance.position.set(0, 0, 6)
        this.cameraGroup.add(this.instance)
        this.scene.add(this.cameraGroup)
    }


    Resize(){
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix();
    }

    Update(){
        if(this.application.world && this.application.world.environment && this.application.world.scroll && this.application.world.cursor){
            this.scrollY = this.application.world.scroll.scroll.Y;
            this.objectsDistance = this.application.world.environment.parameters.objectDistance
            this.cursor = this.application.world.cursor.cursor

            this.instance.position.y = -this.scrollY / this.sizes.height * this.objectsDistance
            this.parallaxX = this.cursor.x * 0.5
            this.parallaxY = -this.cursor.y * 0.5
            this.cameraGroup.position.x += (this.parallaxX - this.cameraGroup.position.x) * this.time.delta * 0.005
            this.cameraGroup.position.y += (this.parallaxY - this.cameraGroup.position.y) * this.time.delta * 0.005
            this.cameraGroup.position.clamp(this.minClamp, this.maxClamp)
        }
    }
}