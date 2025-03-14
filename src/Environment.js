import Application from "./Application.js";
import * as THREE from 'three'

export default class Environment{
    constructor(){
        this.application = new Application()
        this.scene = this.application.scene
        this.resources = this.application.resources

        this.objectDistance = 4;

        this.SetGeometrys()
        this.SetTextures()
        this.SetMaterials()
        this.SetMesh()
        this.SetParticles();
        this.SetLight()
    }

    SetGeometrys(){
        this.torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 60)
        this.coneGeometry = new THREE.ConeGeometry(1, 2, 32)
        this.torusKnotGeometry = new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16)

        this.count = 2000
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
    }

    SetMaterials(){
        this.meshsMaterial = new THREE.MeshStandardMaterial({
            map: this.textures.gradientTexture
        })

        this.particlesMaterial = new THREE.PointsMaterial({
            map: this.particlesMaterial,
            alphaMap: this.textures.particlesTexture,
            transparent: true,
            depthWrite: false,
            color: '#ffeded',
            sizeAttenuation: true,
            size: 0.03,
            blending: THREE.AdditiveBlending
        })
    }

    SetMesh(){
        this.torusMesh = new THREE.Mesh(this.torusGeometry, this.meshsMaterial)
        this.coneMesh = new THREE.Mesh(this.coneGeometry, this.meshsMaterial)
        this.torusKnotMesh = new THREE.Mesh(this.torusKnotGeometry, this.meshsMaterial)
        
        this.torusMesh.position.set(2, -this.objectDistance * 0, 0)
        this.coneMesh.position.set(-2, -this.objectDistance * 1, 0)
        this.torusKnotMesh.position.set(2, -this.objectDistance * 2, 0)
        
        this.scene.add(this.torusMesh, this.coneMesh, this.torusKnotMesh)
        this.sectionMeshes = [this.torusMesh, this.coneMesh, this.torusKnotMesh]
    }
    
    SetParticles(){
        for (let i = 0; i < this.count; i++) {
            this.positions[i * 3] = (Math.random() - 0.5) * 10
            this.positions[i * 3 + 1] = this.objectDistance * 0.5 - Math.random() * this.objectDistance * this.sectionMeshes.length
            this.positions[i * 3 + 2] = (Math.random() - 0.5) * 10
        }
        
        this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial)
        this.scene.add(this.particles)
    }

    SetLight(){
        this.directionalLight = new THREE.DirectionalLight('#ffffff', 3)
        this.directionalLight.position.set(1, 1, 0)
        this.scene.add(this.directionalLight)
    }
}