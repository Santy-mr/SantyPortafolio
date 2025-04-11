import Application from "./Application.js";
import * as THREE from 'three'

export default class Environment{
    constructor(astronaut){
        this.application = new Application()

        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time
        this.debug = this.application.debug

        this.world = this.application.world
        this.scroll = this.world.scroll

        this.astronaut = astronaut

        this.objectDistance = 4;

        if(this.debug.active){
            this.lightsFolder = this.debug.ui.addFolder("Lights")
            this.materialsFolder = this.debug.ui.addFolder("Lights")
        }
        this.parameters = { materialColor: '#ffeded' }

        this.SetGeometrys()
        this.SetTextures()
        this.SetMaterials()
        this.SetMesh()
        this.SetParticles();
        this.SetLight()
    }

    SetGeometrys(){
        this.torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 48)
        this.coneGeometry = new THREE.ConeGeometry(1, 2, 24)
        this.torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.35, 64, 12)

        this.count = 4000
        this.positions = new Float32Array(this.count * 3)
        this.particlesGeometry = new THREE.BufferGeometry()
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    }

    SetTextures(){
        this.textures = {}

        this.textures.particlesTexture = this.resources.items.particlesTexture
        this.textures.particlesTexture.colorSpace = THREE.SRGBColorSpace

        this.textures.gradientTexture = this.resources.items.gradientTexture
        this.textures.gradientTexture.colorSpace = THREE.SRGBColorSpace
        this.textures.gradientTexture.magFilter = THREE.NearestFilter
    }

    SetMaterials(){
        this.meshsMaterial = new THREE.MeshToonMaterial({
            gradientMap: this.textures.gradientTexture,
            color: '#0000ff'
        })

        this.particlesMaterial = new THREE.PointsMaterial({
            map: this.textures.particlesTexture,
            alphaMap: this.textures.particlesTexture,
            transparent: true,
            depthWrite: false,
            color: '#ffeded',
            sizeAttenuation: true,
            size: 0.05,
            blending: THREE.AdditiveBlending
        })

        if(this.debug.active){
            this.materialsFolder.add(this.particlesMaterial, 'size', 0, 1, 0.01).name("Particles Size")
            this.materialsFolder.addColor(this.parameters, 'materialColor').onChange(() =>{ this.particlesMaterial.color.set(this.parameters.materialColor) })
        }
    }

    SetMesh(){
        this.torusMesh = new THREE.Mesh(this.torusGeometry, this.meshsMaterial)
        this.coneMesh = new THREE.Mesh(this.coneGeometry, this.meshsMaterial)
        this.torusKnotMesh = new THREE.Mesh(this.torusKnotGeometry, this.meshsMaterial)

        this.PositionMeshes()
        this.ResponsiveBehavior()
        
        this.scene.add(this.torusMesh, this.coneMesh, this.torusKnotMesh)
        this.sectionMeshes = [this.astronaut, this.torusMesh, this.coneMesh, this.torusKnotMesh]
    }

    PositionMeshes(isMobile = false){
        if (isMobile) {
            this.torusMesh.position.set(0, -this.objectDistance * 1, 0)
            this.coneMesh.position.set(0, -this.objectDistance * 2, 0)
            this.torusKnotMesh.position.set(0, -this.objectDistance * 3, 0)
            this.astronaut.model.position.set(0, -1, 1)

            this.torusMesh.scale.setScalar(0.5)
            this.coneMesh.scale.setScalar(0.5)
            this.torusKnotMesh.scale.setScalar(0.5)
            this.astronaut.model.scale.setScalar(0.8)

        } else {
            this.torusMesh.position.set(1.75, -this.objectDistance * 1, 0)
            this.coneMesh.position.set(-1.75, -this.objectDistance *2, 0)
            this.torusKnotMesh.position.set(1.75, -this.objectDistance * 3, 0)
            this.astronaut.model.position.set(0, -1.25, 1)
            
            this.torusMesh.scale.setScalar(1)
            this.coneMesh.scale.setScalar(1)
            this.torusKnotMesh.scale.setScalar(1)
            this.astronaut.model.scale.setScalar(1)
        }
    }

    ResponsiveBehavior(){
        const mobileMediaQuery = window.matchMedia('(max-width: 600px)')
        this.PositionMeshes(mobileMediaQuery.matches)

        mobileMediaQuery.addEventListener('change', (event) => {
            this.PositionMeshes(event.matches);
        });
    }
    
    SetParticles(){
        for (let i = 0; i < this.count; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * 10
            this.positions[i * 3 + 1] = this.objectDistance * 0.5 - Math.random() * this.objectDistance * 4
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
        this.scene.add(this.particles)
    }

    SetLight(){
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        this.directionalLight.position.set(1, 1, 0)
        this.scene.add(this.directionalLight)

        this.ambientLight = new THREE.AmbientLight()
        this.scene.add(this.ambientLight)

        if(this.debug.active){
            this.lightsFolder.add(this.directionalLight, 'intensity', 0, 10, 1).name("Light Intensity")
            this.lightsFolder.add(this.directionalLight.position, 'x', -5, 5, 0.001).name('Light PosX')
            this.lightsFolder.add(this.directionalLight.position, 'y', -5, 5, 0.001).name('Light PosY')
            this.lightsFolder.add(this.directionalLight.position, 'z', -5, 5, 0.001).name('Light PosZ')
        }
    }

    Update(){
        const currentSection = this.scroll.GetCurrentSection();

        if(currentSection === 0){
            this.astronaut.animation.actions.salute.play();
        } 
        else{
            this.astronaut.animation.actions.salute.stopFading();
            this.astronaut.animation.actions.salute.reset(); 
        }

        
        for (let i = 1; i < this.sectionMeshes.length; i++) {
            this.sectionMeshes[i].rotation.x += this.time.delta * 0.0001
            this.sectionMeshes[i].rotation.y += this.time.delta * 0.00012
        }
    }
}