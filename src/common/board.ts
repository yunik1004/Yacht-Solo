import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import diceMTLURL from '../assets/dice.mtl?url'
import diceOBJURL from '../assets/dice.obj?url'

export class Board {
    private readonly scene: THREE.Scene
    private readonly camera: THREE.PerspectiveCamera
    private readonly renderer: THREE.WebGLRenderer

    private readonly dice: Dice

    constructor(width: number, height: number) {
        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        this.camera.position.z = 5
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.animate = this.animate.bind(this)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        this.scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 0.8)
        pointLight.position.set(-5, 0, 5)
        this.scene.add(pointLight)

        this.dice = new Dice(this.scene)
    }

    update(): void {
        this.dice.update()
    }

    resize(width: number, height: number): void {
        this.camera.aspect = width / height
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

    getRendererDomElement(): HTMLCanvasElement {
        return this.renderer.domElement
    }

    animate(): void {
        requestAnimationFrame(this.animate)
        this.update()
        this.renderer.render(this.scene, this.camera)
    }
}

class Dice {
    object: THREE.Group

    constructor(scene: THREE.Scene) {
        this.object = new THREE.Group()

        const mtlLoader = new MTLLoader()
        mtlLoader.load(diceMTLURL, (materials) => {
            materials.preload()

            const objLoader = new OBJLoader()
            objLoader.setMaterials(materials)
            objLoader.load(diceOBJURL, (object) => {
                scene.add(object)
                this.object = object
            }, (xhr) => { }, (error) => {
                alert("Failed to load the dice object.")
            })
        })
    }

    update(): void {
        this.object.rotation.x += 0.01
        this.object.rotation.y += 0.01
    }
}
