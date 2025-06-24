import * as THREE from 'three'

export default class Environment{
    constructor(application, astronaut, planet){
        this.application = application

        this.scene = this.application.scene
        this.resources = this.application.resources
        this.time = this.application.time
        this.debug = this.application.debug

        this.world = this.application.world
        this.scroll = this.world.scroll

        this.astronaut = astronaut
        this.planet = planet

        this.particlesGeometry = null
        this.particles = null

        if(this.debug.active){
            this.lightsFolder = this.debug.ui.addFolder("Lights")
            this.materialsFolder = this.debug.ui.addFolder("Particles")
            this.environmentFolder = this.debug.ui.addFolder("Env Map")
        }

        this.parameters = { 
            materialColor: '#ffeded',
            lightColor: '#ffffff',
            objectDistance: 4,
            sections: 5,
            count: 4000,
            envMapInt: 2
        }

        this.layouts = {
            desktop: {
                positions: {
                  planet: [1.5, -this.parameters.objectDistance * 1, 0],
                  cone: [-1.75, -this.parameters.objectDistance * 2, 0],
                  torusKnot: [-1.75, -this.parameters.objectDistance * 4, 0],
                  astronaut: [0, -1.25, 1]
                },
                scales: {
                  planet: 0.6,
                  cone: 1,
                  torusKnot: 1,
                  astronaut: 1
                }
            },

            mobile: {
              positions: {
                planet: [0, -this.parameters.objectDistance * 1, 0],
                cone: [0, -this.parameters.objectDistance * 2, 0],
                torusKnot: [0, -this.parameters.objectDistance * 4, 0],
                astronaut: [0, -1, 1]
              },
              scales: {
                planet: 0.35,
                cone: 0.5,
                torusKnot: 0.5,
                astronaut: 0.8
              }
            }
        };

        this.SetGeometrys()
        this.SetTextures()
        this.SetMaterials()
        this.SetMesh()
        this.SetParticles();
        this.SetLight()
    }

    SetGeometrys(){
        this.coneGeometry = new THREE.ConeGeometry(1, 2, 24)
        this.torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.35, 64, 12)

        this.positions = new Float32Array(this.parameters.count * 3)
        this.particlesGeometry = new THREE.BufferGeometry()
        this.particlesGeometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3))
    }

    SetTextures(){
        this.textures = {}

        this.textures.particlesTexture = this.resources.items.particlesTexture
        this.textures.particlesTexture.colorSpace = THREE.SRGBColorSpace

        this.textures.envMap = this.resources.items.environmentMapTexture
        this.textures.envMap.mapping = THREE.EquirectangularReflectionMapping
        this.scene.environment = this.textures.envMap
        this.scene.environmentIntensity = this.parameters.envMapInt

        if(this.debug.active){
            this.environmentFolder.add(this.parameters, 'envMapInt', 0, 10, 0.01).name('Env Map Intensity').onChange(() => {this.scene.environmentIntensity = this.parameters.envMapInt})
        }
    }

    SetMaterials(){
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
        this.coneMesh = new THREE.Mesh(this.coneGeometry, this.meshsMaterial)
        this.torusKnotMesh = new THREE.Mesh(this.torusKnotGeometry, this.meshsMaterial)

        this.PositionMeshes()
        this.ResponsiveBehavior()
        
        this.scene.add(this.coneMesh, this.torusKnotMesh)
        this.sectionMeshes = [this.astronaut, this.planet, this.coneMesh, this.torusKnotMesh]
    }

    PositionMeshes(isMobile = false){
        const layout = isMobile ? this.layouts.mobile : this.layouts.desktop;

        const { positions, scales } = layout;
        
        this.planet.model.position.set(...positions.planet);
        this.coneMesh.position.set(...positions.cone);
        this.torusKnotMesh.position.set(...positions.torusKnot);
        this.astronaut.model.position.set(...positions.astronaut);
        
        this.planet.model.scale.setScalar(scales.planet);
        this.coneMesh.scale.setScalar(scales.cone);
        this.torusKnotMesh.scale.setScalar(scales.torusKnot);
        this.astronaut.model.scale.setScalar(scales.astronaut);
    }

    ResponsiveBehavior(){
        const mobileMediaQuery = window.matchMedia('(max-width: 600px)')
        this.PositionMeshes(mobileMediaQuery.matches)

        mobileMediaQuery.addEventListener('change', (event) => {
            this.PositionMeshes(event.matches);
        });
    }
    
    SetParticles(){
        for (let i = 0; i < this.parameters.count; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * 10
            this.positions[i * 3 + 1] = this.parameters.objectDistance * 0.5 - Math.random() * this.parameters.objectDistance * this.parameters.sections
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
        this.scene.add(this.particles)
    }

    SetLight(){
        this.directionalLight = new THREE.DirectionalLight(this.parameters.lightColor, 3)
        this.directionalLight.position.set(1, 1, 0)
        this.scene.add(this.directionalLight)

        if(this.debug.active){
            this.lightsFolder.add(this.directionalLight, 'intensity', 0, 10, 1).name("Light Intensity")
            this.lightsFolder.addColor(this.parameters, 'lightColor').onChange(() =>{ this.directionalLight.color.set(this.parameters.lightColor) })
            this.lightsFolder.add(this.directionalLight.position, 'x', -5, 5, 0.001).name('Light PosX')
            this.lightsFolder.add(this.directionalLight.position, 'y', -5, 5, 0.001).name('Light PosY')
            this.lightsFolder.add(this.directionalLight.position, 'z', -5, 5, 0.001).name('Light PosZ')
        }
    }

    Update(){
        const currentSection = this.scroll.GetCurrentSection();

        if(currentSection === 0 || currentSection === 1){
            this.astronaut.animation.actions.salute.play();
        } 
        else{
            this.astronaut.animation.actions.salute.stopFading();
            this.astronaut.animation.actions.salute.reset(); 
        }
    }
}