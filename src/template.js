import Visualize from './classes/visualize'
import { getRandomElement } from './util/array'
import { interpolateRgb, interpolateNumber } from 'd3-interpolate'
const THREE = require('three')

export default class Template extends Visualize {
    constructor() {
        super({ volumeSmoothing: 10 })
        this.theme = ['#0FC0FC', '#7B1DAF', '#FF2FB9', '#D4FF47', '#1B3649']
        this.count = 0
        this.cameraCount = 0
        this.arrXPos = []
        this.arrXPosNext = []
        this.arrYPos = []
        this.arrYPosNext = []
    }

    hooks() {
        this.sync.on('tatum', tatum => {
            this.lastColor = this.nextColor || getRandomElement(this.theme)
            this.nextColor = getRandomElement(this.theme.filter(color => color !== this.nextColor))   
        })
    
        this.sync.on('segment', segment => {
            this.offsetFactor = Math.random()
            this.arrXPos = []
            this.arrXPosNext = []
            this.arrYPos = []
            this.arrXPosNext = []
        }) 
    
        this.sync.on('beat', beat => {
            this.count++
            this.scaleFactor = Math.pow((this.sync.volume + 2 / 2), 3.5) + (Math.random() / 4)
        })
    
        this.sync.on('bar', bar => {
            this.lightInt = Math.random() / 2
        }) 
    
        this.sync.on('section', section => {
            this.cameraCount++
        }) 
    }

    render({ renderer, scene, camera, orbitControls }) {
        var scaleFactor = this.scaleFactor
        var count = this.count

        //clubbers jump
        var progress = this.sync.beat.progress
        var clubbers = scene.getObjectByName('clubbers')
        var alt = 0
        clubbers.children.forEach((child) => {
            if (count % 2 == 0) {
                if (alt % 2 == 0) {
                    child.position.y = interpolateNumber(-72, -72 + scaleFactor)(progress)  
                } else {
                    child.position.y = interpolateNumber(-72 + scaleFactor, -72)(progress) 
                }
            } else {
                if (alt % 2 == 0) {
                    child.position.y = interpolateNumber(-72 + scaleFactor, -72)(progress)   
                } else {
                    child.position.y = interpolateNumber(-72, -72 + scaleFactor)(progress)  
                }
            }
            alt++
        }) 
        var dj = scene.getObjectByName('dj')
        if (count % 2 == 0) {  
            dj.rotation.x = 0.05
            dj.position.y = -8
        } else {
            dj.rotation.x = 0
            dj.position.y = 0
        }

        //change lighting
        var lastColor = this.lastColor
        var nextColor = this.nextColor
        progress = this.sync.tatum.progress
        var color = new THREE.Color(interpolateRgb(lastColor, nextColor)(progress))
        var fog = scene.fog
        fog.color = color

        progress = this.sync.bar.progress
        var djLight = scene.getObjectByName('djLight')
        djLight.color = color
        var roomLight = scene.getObjectByName('roomLight')
        roomLight.intensity = interpolateNumber(roomLight.intensity, this.lightInt)(progress)
        djLight.intensity = interpolateNumber(djLight.intensity, this.lightInt)(progress)

        var LED = scene.getObjectByName('LED')
        LED.children.forEach((child) => {
            child.children[0].material.color = color
        })

        //mover lasers
        progress = this.sync.segment.progress
        var nextXPos, nextYPos, sign
        var lasers = scene.getObjectByName('lasers')
        var arrXPos = this.arrXPos
        var arrXPosNext = this.arrXPosNext
        var arrYPos = this.arrYPos
        var arrYPosNext = this.arrYPosNext
        if (arrXPos.length == 0) {
            lasers.children.forEach((child) => {
                sign = Math.random() < 0.5 ? -1 : 1
                nextXPos = sign * Math.random() * 400
                arrXPos.push(child.geometry.attributes.position.array[3])
                arrXPosNext.push(nextXPos)
                sign = Math.random() < 0.5 ? -1 : 1
                nextYPos = sign * Math.random() * 200 - 50
                arrYPos.push(child.geometry.attributes.position.array[4])
                arrYPosNext.push(nextYPos)
            })
        }

        color = getRandomElement(this.theme)
        var countChildren = 0
        lasers.children.forEach((child) => {
            child.geometry.attributes.position.array[3] = interpolateNumber(arrXPos[countChildren], arrXPosNext[countChildren])(progress)
            child.geometry.attributes.position.array[4] = interpolateNumber(arrYPos[countChildren], arrYPosNext[countChildren])(progress)
            child.geometry.attributes.position.needsUpdate = true
            countChildren++
        })

        if (this.cameraCount % 2 == 0) {
            camera.position.set(140, 30, -160)
            camera.up = new THREE.Vector3(0,1,0)
            camera.lookAt(scene)
        } else {
            camera.position.set(-20, 10, 190)
            camera.up = new THREE.Vector3(0,1,0)
            camera.lookAt(scene)
        }

        orbitControls.update()
        renderer.render(scene, camera) 
    }
}