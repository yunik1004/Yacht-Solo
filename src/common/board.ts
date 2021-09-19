import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import diceMTLURL from '../assets/dice.mtl?url'
import diceOBJURL from '../assets/dice.obj?url'

export class Board {
    private readonly world: CANNON.World
    private readonly timeStep: number
    private lastCallTime: number

    private readonly scene: THREE.Scene
    private readonly camera: THREE.PerspectiveCamera
    private readonly renderer: THREE.WebGLRenderer

    private readonly dice: Dice

    constructor(width: number, height: number) {
        this.world = new CANNON.World({
            gravity: new CANNON.Vec3(0, 0, -9.82),
        })
        this.timeStep = 1 / 60 // seconds
        this.lastCallTime = -1

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
        this.camera.position.z = 5
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setSize(width, height)
        this.animate = this.animate.bind(this)

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
        this.scene.add(ambientLight)

        const pointLight = new THREE.PointLight(0xffffff, 0.8)
        pointLight.position.set(-5, 0, 5)
        this.scene.add(pointLight)

        // Ground
        const groundBody = new CANNON.Body({
            type: CANNON.Body.STATIC,
            shape: new CANNON.Plane()
        })
        groundBody.position.set(0, 0, -5)
        this.world.addBody(groundBody)

        // Additional objects
        this.dice = new Dice(this.scene, this.world)
    }

    drag(start_x: number, start_y: number, end_x: number, end_y: number): void {
        const topPoint = new CANNON.Vec3(0, 0, 1)
        const impulse = new CANNON.Vec3((end_x - start_x) * this.timeStep, -(end_y - start_y) * this.timeStep, 0)
        this.dice.boxBody.applyImpulse(impulse, topPoint)
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

        const time = performance.now() / 1000 // seconds
        if (this.lastCallTime < 0) {
            this.world.step(this.timeStep)
        } else {
            const dt = time - this.lastCallTime
            this.world.step(this.timeStep, dt)
        }
        this.lastCallTime = time

        this.update()
        this.renderer.render(this.scene, this.camera)
    }
}

class Dice {
    object: THREE.Group
    boxBody: CANNON.Body

    constructor(scene: THREE.Scene, world: CANNON.World) {
        this.object = new THREE.Group()
        this.boxBody = new CANNON.Body()

        const mtlLoader = new MTLLoader()
        mtlLoader.load(diceMTLURL, (materials) => {
            materials.preload()

            const objLoader = new OBJLoader()
            objLoader.setMaterials(materials)
            objLoader.load(diceOBJURL, (object) => {
                scene.add(object)
                this.object = object

                const halfExtents = new CANNON.Vec3(1, 1, 1)
                const boxShape = new CANNON.Box(halfExtents)
                this.boxBody = new CANNON.Body({ mass: 1, shape: boxShape })
                world.addBody(this.boxBody)
            }, (xhr) => { }, (error) => {
                alert("Failed to load the dice object.")
            })
        })
    }

    update(): void {
        //this.object.position.copy(this.boxBody.position)
        this.object.position.set(this.boxBody.position.x, this.boxBody.position.y, this.boxBody.position.z)

        //this.object.quaternion.copy(this.boxBody.quaternion)
        this.object.quaternion.set(this.boxBody.quaternion.x, this.boxBody.quaternion.y, this.boxBody.quaternion.z, this.boxBody.quaternion.w)
    }
}
