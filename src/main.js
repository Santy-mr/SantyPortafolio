import * as THREE from 'three'
import GUI from 'lil-gui';
import gsap from 'gsap';

const canvas = document.querySelector('#bg2')
const scene = new THREE.Scene();
const gui = new GUI({
    width: 300,
    name: 'Tweeks'
})

const textureLoader = new THREE.TextureLoader();
const gradientTexture = textureLoader.load('/textures/gradients/3.webp')
gradientTexture.magFilter = THREE.NearestFilter
const particlesTexture = textureLoader.load('/textures/particles/5.webp')

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio), 2)
})

const parameters = {
    materialColor: '#ffeded'
}

const material = new THREE.MeshNormalMaterial({
    flatShading: true
    // color:parameters.materialColor,
    // gradientMap: gradientTexture
})

const objectsDistance = 4
const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1, 0.4, 16, 60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1, 2, 32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material
)

mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

mesh1.position.y = - objectsDistance * 0
mesh2.position.y = - objectsDistance * 1
mesh3.position.y = - objectsDistance * 2
scene.add(mesh1, mesh2, mesh3)
const sectionMeshes = [mesh1, mesh2, mesh3]

const count = 2000;
const positions = new Float32Array(count * 3)
const particleGeometry = new THREE.BufferGeometry()
for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * sectionMeshes.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
const particlesMaterial = new THREE.PointsMaterial({
    map: particlesTexture,
    alphaMap: particlesTexture,
    transparent: true,
    depthWrite: false,
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03,
    blending: THREE.AdditiveBlending
})
const particles = new THREE.Points(particleGeometry, particlesMaterial)
scene.add(particles)

const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

gui.addColor(parameters, 'materialColor').onChange(() => {
    //material.color.set(parameters.materialColor),
    particlesMaterial.color.set(parameters.materialColor)

})
gui.add(directionalLight, 'intensity', 0, 10, 1)
gui.add(particlesMaterial, 'size', 0, 1, 0.01)

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0, 0, 6)
cameraGroup.add(camera)

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
// renderer.setClearAlpha(0.5)
renderer.setSize(sizes.width, sizes.height)

//Scroll
let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {
        currentSection = newSection
        gsap.to(sectionMeshes[currentSection].rotation, {
            duration: 1.5,
            ease: 'power2.inOut',
            x: '+=6',
            y: '+=3',
            z: '+=1.5'
        })
    }
})

//Cursor
const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (e) => {
    cursor.x = (e.clientX / sizes.width) - 0.5
    cursor.y = (e.clientY / sizes.height) - 0.5
})

const clock = new THREE.Clock()
let previousTime = 0

function animate() {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    //Animate Camera
    camera.position.y = -scrollY / sizes.height * objectsDistance
    const parallaxX = cursor.x * 0.5
    const parallaxY = -cursor.y * 0.5
    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    //Animate meshes
    for (const mesh of sectionMeshes) {
        mesh.rotation.x += deltaTime * 0.1
        mesh.rotation.y += deltaTime * 0.12
    }

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}
animate();