import * as THREE from 'three'
import GUI from 'lil-gui'
import gsap from 'gsap'

import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
/**
 * Debug
 */
const gui = new GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui.addColor(parameters, 'materialColor')
.onChange(()=>
{
    material.color.set(parameters.materialColor)
}

)
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * objects
 */
const objectDistances=4
const material = new THREE.MeshToonMaterial({color:parameters.materialColor})
const fontloader = new FontLoader()
const mesh1= fontloader.load(
    'fonts/helvetiker_regular.typeface.json',
    (mesh1)=>
    {
        const textgeometry= new TextGeometry("How's the weather?",{
            font: mesh1,
                size: 0.5,
                height: 0.2,
                curveSegments: 1,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 1,
                spin:1.722
        }
        )
        textgeometry.computeBoundingBox()
        textgeometry.translate(
    -(textgeometry.boundingBox.max.x-0.02)*0.5,
    -(textgeometry.boundingBox.max.y-0.02)*0.5,
    -(textgeometry.boundingBox.max.z-0.03)*0.5,
    
)
         const textMaterial = new THREE.MeshBasicMaterial({wireframe:true})
        const text = new THREE.Mesh(textgeometry, textMaterial)
        scene.add(text)
    }

)
const textureLoader = new THREE.TextureLoader()
const earth = textureLoader.load('/textures/matcaps/2k_earth_daymap.jpg')
earth.colorSpace = THREE.SRGBColorSpace
/*const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(1, 14, 32),
   )
   const earthmaetrial= new THREE. MeshBasicMaterial({map:earth})
   const erathtexture= new THREE.Mesh(mesh2,earthmaetrial)
   scene.add(erathtexture)
*/const geometry = new THREE.SphereGeometry( 1, 14, 32 ); 
const materialearth = new THREE.MeshBasicMaterial( { map:earth  } ); 
const sphere = new THREE.Mesh( geometry, materialearth ); 
scene.add( sphere );

sphere.position.y= -objectDistances*1
sphere.position.x = -2


/*const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
    material)
mesh3.position.x = 2*/

//mesh1.position.y= -objectDistances*0
//mesh3.position.y= -objectDistances*1
//mesh3.position.y= -objectDistances*2


scene.add(sphere)//,mesh3)
const section=[mesh1,sphere]//,mesh3]
/**
 * texture
 */

/**
 * light
 */
const directionalLight = new THREE.DirectionalLight('#ffffff', 3)
directionalLight.position.set(1,1,0)
scene.add(directionalLight)
/**
 * Particles
 */
// Geometry
const particlesCount = 500
const positions = new Float32Array(particlesCount * 3)
for(let i = 0; i < particlesCount; i++)
{
    positions[i * 3 + 0] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = objectDistances * 0.5 - Math.random() * objectDistances * section.length
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
}
const particlesGeometry = new THREE.BufferGeometry()
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
// Material
const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation: true,
    size: 0.03
})
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
const cameragroup= new THREE.Group()
scene.add(cameragroup)
// Base camera
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6

cameragroup.add(camera)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha:true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
/**
 * scoll
 */
let scrollY= window.scrollY
let currentsection=0
window.addEventListener('scroll', () =>
{
    scrollY = window.scrollY
const newsection= Math.round(scrollY/sizes.height)
if(newsection!= currentsection){
    currentsection= newsection
    gsap.to(
        section[currentsection].rotation,{
            duration: 1.5,
                ease: 'power2.inOut',
                x: '+=6',
                y: '+=3',
                z:'+=1.5'

        }
    )
}
})
/**
 * Cursor
 */
const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('mousemove', (event) =>
{
    cursor.x = event.clientX/sizes.width
    cursor.y = event.clientY/sizes.height

    
})
/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime=0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime
    camera.position.y= -scrollY/sizes.height*objectDistances
    const parallaxX = cursor.x*0.5
    const parallaxY = -cursor.y*0.5
    cameragroup.position.x += (parallaxX - cameragroup.position.x)*0.1
    cameragroup.position.y += (parallaxY - cameragroup.position.y) *0.1

/* animation 
for(const mesh of section){
    mesh.rotation.x+=deltaTime*0.1
    mesh.rotation.y+=deltaTime*0.12
}*/
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
//weather
const apiKey = 'c21cd07344f806b2822a39aba1c427cf';
const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

const locationInput = document.getElementById('locationInput');
const searchButton = document.getElementById('searchButton');
const locationElement = document.getElementById('location');
const temperatureElement = document.getElementById('temperature');


searchButton.addEventListener('click', () => {
    const location = locationInput.value;
    if (location) {
        fetchWeather(location);
    }
});

function fetchWeather(location) {
    const url = `${apiUrl}?q=${location}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            locationElement.textContent = data.name;
            temperatureElement.textContent = `${Math.round(data.main.temp)}°C`;
            
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}
