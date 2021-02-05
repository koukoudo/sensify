const THREE = require('three')
import { getRandomElement } from '../util/array'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import wall2 from '../../assets/textures/wall2.jpg'
import floor1 from '../../assets/textures/floor1.jpg'
import underground from '../../assets/textures/underground.jpg'
import clubber from '../../assets/objects/clubber.obj'
import mask from '../../assets/objects/mask.obj'
import mixer from '../../assets/objects/mixer.obj'
import mixerMat from '../../assets/textures/mixer.mtl'
import speaker from '../../assets/objects/speaker.obj'
import jellyfish from '../../assets/textures/jellyfish.jpg'
import stageLight from '../../assets/objects/stageLight.obj'
import video from '../../assets/textures/video.mp4'


export default class Animate {
    constructor ({
        main = null,
        hidpi = true,
        container = document.body,
        width = window.innerWidth,
        height = window.innerHeight
        }) {
        this.main = main
        this.hidpi = hidpi
        this.container = container
        this.width = width
        this.height = height
        this.active = false
        this.queue = []

        RectAreaLightUniformsLib.init();

        //scene
        var scene = new THREE.Scene()
        scene.fog = new THREE.Fog(0x808080, 50, 500)

        //camera
        var camera = new THREE.PerspectiveCamera(90, this.width/this.height, 0.1, 500)
        camera.position.set(140, 30, -160)
        camera.up = new THREE.Vector3(0,1,0)
        camera.lookAt(scene)

        //renderer
        var renderer = new THREE.WebGLRenderer()
        renderer.shadowMap.enabled = true
        renderer.setClearColor(0xEEEEEE)
        renderer.setSize(this.width, this.height)

        //lights
        var light = new THREE.SpotLight(0xffffff, 0.7)
        light.angle = Math.PI / 6
        light.position.set(0, 75, -160)
        light.target.position.set(0,-70,-160) 
        scene.add(light.target)
        scene.add(light)

        light = new THREE.RectAreaLight(0xffff00, 1)
        light.position.set(0, 56, -175)
        var lightMesh = new THREE.Mesh( new THREE.CircleBufferGeometry(0.4), new THREE.MeshBasicMaterial({side: THREE.FrontSide}));
        lightMesh.scale.x = light.width;
        lightMesh.scale.y = light.height;
        light.add(lightMesh);
        scene.add(light)

        light = new THREE.PointLight(0xffff00, 0.3)
        light.position.set(0, 70, 0)
        light.name = "djLight"
        scene.add(light)

        light = new THREE.AmbientLight(0xffffff, 0.3)
        light.position.set(0, 0, 0)
        light.name = "roomLight"
        scene.add(light)  

        var LED = new THREE.Group()
        LED.name = 'LED'

        light = new THREE.RectAreaLight(0xffffff, 1, 2, 400)
        light.position.set(149, 74, 0)
        var lightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.FrontSide } ) );
        lightMesh.scale.x = light.width;
        lightMesh.scale.y = light.height;
        lightMesh.rotateX(1.57)
        lightMesh.rotateY(-0.5)
        light.add(lightMesh);
        LED.add(light)

        light = new THREE.RectAreaLight(0xffffff, 1, 2, 400)
        light.position.set(-149, 74, 0)
        var lightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.FrontSide } ) );
        lightMesh.scale.x = light.width;
        lightMesh.scale.y = light.height;
        lightMesh.rotateX(1.57)
        lightMesh.rotateY(0.5)
        light.add(lightMesh);
        LED.add(light)

        light = new THREE.RectAreaLight(0xffffff, 1, 2, 250)
        light.position.set(0, 74, 198)
        var lightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.FrontSide } ) );
        lightMesh.scale.x = light.width;
        lightMesh.scale.y = light.height;
        lightMesh.rotateX(0.5)
        lightMesh.rotateY(1.57)
        lightMesh.rotateX(1.57)
        light.add(lightMesh);
        LED.add(light)

        light = new THREE.RectAreaLight(0xffffff, 1, 2, 250)
        light.position.set(0, 74, -198)
        var lightMesh = new THREE.Mesh( new THREE.PlaneBufferGeometry(), new THREE.MeshBasicMaterial( { side: THREE.FrontSide } ) );
        lightMesh.scale.x = light.width;
        lightMesh.scale.y = light.height;
        lightMesh.rotateX(-0.5)
        lightMesh.rotateY(1.57)
        lightMesh.rotateX(1.57)
        light.add(lightMesh);
        LED.add(light)

        scene.add(LED)

        var objLoader, matLoader, loader
        var m = new THREE.Matrix4()

        //warehouse
        var tex = new THREE.TextureLoader().load(wall2)
        tex.wrapS = THREE.RepeatWrapping;
        tex.repeat.x = - 1;
        var videoElem = document.createElement('video')
        videoElem.src = video
        videoElem.autoplay = true
        videoElem.loop = true

        var videoTex = new THREE.VideoTexture(videoElem);
        var material = [
            new THREE.MeshPhongMaterial({map: tex, side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(wall2), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(floor1), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(underground), side: THREE.BackSide}),
            new THREE.MeshPhongMaterial({map: videoTex, side: THREE.BackSide}),
        ]
        var box = new THREE.BoxBufferGeometry(300, 150, 400)
        var mesh = new THREE.Mesh(box, material)
        mesh.scale.x = -1
        mesh.name = "warehouse"
        mesh.receiveShadow = true
        scene.add(mesh) 

        //laser
        objLoader = new OBJLoader()
        .load(stageLight, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x111111, emissive: 0x000000, specular: 0x111111, shininess: 100})
            object.children[0].material = material 
            m.set(2,0,0,0,
                0,2,0,0,
                0,0,2,0,
                0,0,0,1)
            object.applyMatrix4(m) 
            object.translateY(78)
            object.translateZ(-180) 
            object.rotateZ(3.14)
            scene.add(object)
        })

        var lineGeo, line, sign, points, xPos, yPos
        var lasers = new THREE.Group()
        lasers.name = 'lasers'
        material = new THREE.LineBasicMaterial({color: 0xffff00, transparent: true, opacity: 0.3});
        for (var i = 0; i < 10; i++) {
            points = []
            points.push(new THREE.Vector3(0, 55, -175));
            sign = Math.random() < 0.5 ? -1 : 1
            xPos = sign * Math.random() * 400
            sign = Math.random() < 0.5 ? -1 : 1
            yPos = sign * Math.random() * 200 - 50
            points.push(new THREE.Vector3(xPos, yPos, 200));
            lineGeo = new THREE.BufferGeometry().setFromPoints(points);
            line = new THREE.Line(lineGeo, material);
            lasers.add(line)
        }

        scene.add(lasers);

        //dj booth
        var box = new THREE.BoxBufferGeometry(60,40,30)
        material = [
            new THREE.MeshPhongMaterial({color: 0x000000}),
            new THREE.MeshPhongMaterial({color: 0x000000}),
            new THREE.MeshPhongMaterial({color: 0x000000}),
            new THREE.MeshPhongMaterial({color: 0x000000}),
            new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(jellyfish)}),
            new THREE.MeshPhongMaterial({color: 0x000000})
        ]
        mesh = new THREE.Mesh(box, material)
        mesh.translateY(-55)
        mesh.translateZ(-135) 
        scene.add(mesh) 

        //mixer
        matLoader = new MTLLoader()
        .load(mixerMat, (material) => {
            objLoader = new OBJLoader()
            .setMaterials(material)
            .load(mixer, (object) => {
                m.set(3,0,0,0,
                    0,3,0,0,
                    0,0,3,0,
                    0,0,0,1)
                object.applyMatrix4(m) 
                object.translateY(-35)
                object.translateZ(-135) 
                object.rotateY(3.14)
                scene.add(object)
            })
        })

        //dj
        var dj = new THREE.Group()
        dj.name = 'dj'
        objLoader = new OBJLoader()
        .load(clubber, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x3F469E, emissive: 0x21255D, specular: 0xffffff, reflectivity: 0.2, shininess: 0, side: THREE.DoubleSide})
            object.children[0].material = material 
            m.set(15,0,0,0,
                0,15,0,0,
                0,0,15,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateY(-75)
            object.translateZ(-165)
            dj.add(object)
        })

        //dj mask
        objLoader = new OBJLoader()
        .load(mask, (object) => {
            object.children.forEach((child) => {
                if (child.name == '13547PlagueDoctorMask_eyeR' || child.name == '13547PlagueDoctorMask_eyeL') {
                    material = new THREE.MeshPhongMaterial({color: 0x000000, emissive: 0x000000, specular: 0xffffff, shininess: 100})
                } else {
                    material = new THREE.MeshPhongMaterial({color: 0xD4AF37, emissive: 0x000000, specular: 0xffffff, shininess: 100})
                }
                child.material = material  
            })
            m.set(0.9,0,0,0,
                0,1.1,0,0,
                0,0,0.7,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateY(-18)
            object.translateZ(-193)
            object.rotateX(-1.57)
            dj.add(object)
        })

        scene.add(dj)

        //speakers
        var speakers = new THREE.Group()
        objLoader = new OBJLoader()
        .load(speaker, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x111111, emissive: 0x000000, specular: 0x111111, shininess: 100})
            object.children[0].material = material 
            m.set(15,0,0,0,
                0,15,0,0,
                0,0,15,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateX(125)
            object.translateY(62)
            object.translateZ(-180)
            object.rotateY(-0.5)
            object.rotateZ(3.14)
            speakers.add(object)
        })

        objLoader = new OBJLoader()
        .load(speaker, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x111111, emissive: 0x000000, specular: 0x111111, shininess: 100})
            object.children[0].material = material 
            m.set(15,0,0,0,
                0,15,0,0,
                0,0,15,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateX(-125)
            object.translateY(62)
            object.translateZ(-180)
            object.rotateY(0.5)
            object.rotateZ(3.14)
            speakers.add(object)
        })

        objLoader = new OBJLoader()
        .load(speaker, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x111111, emissive: 0x000000, specular: 0x111111, shininess: 100})
            object.children[0].material = material 
            m.set(15,0,0,0,
                0,15,0,0,
                0,0,15,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateX(125)
            object.translateY(62)
            object.translateZ(180)
            object.rotateY(3.64)
            object.rotateZ(3.14)
            speakers.add(object)
        })

        objLoader = new OBJLoader()
        .load(speaker, (object) => {
            material = new THREE.MeshPhongMaterial({color: 0x111111, emissive: 0x000000, specular: 0x111111, shininess: 100})
            object.children[0].material = material 
            m.set(15,0,0,0,
                0,15,0,0,
                0,0,15,0,
                0,0,0,1)
            object.applyMatrix4(m)
            object.translateX(-125)
            object.translateY(62)
            object.translateZ(180)
            object.rotateY(-3.64)
            object.rotateZ(3.14)
            speakers.add(object)
        })

        scene.add(speakers)

        //clubbers
        var clubbers = new THREE.Group()
        clubbers.name= "clubbers"
        var sign, zPos
        var colors = [0xc58c58, 0xecbcb4, 0xd1a3a4, 0xa1665e, 0x503335, 0x592f2a]
        var arrX = []
        var arrZ = []
        for (var i = 0; i < 30; i++) {
            loader = new OBJLoader()
            .load(clubber, (object) => {
                sign = Math.random() < 0.5 ? -1 : 1
                xPos = sign * Math.random() * 130
                sign = Math.random() < 0.5 ? -1 : 1
                zPos = sign * Math.random() * 140 + 40
                while (this.validatePos(xPos, zPos, arrX, arrZ) == false) {
                    sign = Math.random() < 0.5 ? -1 : 1
                    xPos = sign * Math.random() * 130
                    sign = Math.random() < 0.5 ? -1 : 1
                    zPos = sign * Math.random() * 140 + 40
                }
                arrX.push(xPos)
                arrZ.push(zPos)
                m.set(8,0,0,0,
                    0,8,0,0,
                    0,0,8,0,
                    0,0,0,1)
                var skinColor = getRandomElement(colors)
                material = new THREE.MeshPhongMaterial({color: skinColor, emissive: 0x000000, specular: skinColor, shininess: 0})
                object.children[0].material = material 
                object.applyMatrix4(m)
                object.rotateY(3.14)
                object.position.x = xPos
                object.position.y = -72
                object.position.z = zPos
                clubbers.add(object)
            }) 
        }

        scene.add(clubbers)

        var orbitControls = new OrbitControls(camera, renderer.domElement);
        orbitControls.update()

        document.getElementById("WebGL-output")
        .appendChild(renderer.domElement)
        renderer.render(scene, camera)

        this.renderer = renderer
        this.scene = scene
        this.camera = camera
        this.orbitControls = orbitControls

        orbitControls.addEventListener('change', () => {
            this.active = true
            requestAnimationFrame(this.loop.bind(this))
        }) 

        if (width === window.innerWidth && height == window.innerHeight) {
            window.addEventListener('resize', () => {
              this.width = window.innerWidth
              this.height = window.innerHeight
              this.camera.aspect = this.width/this.height
              this.renderer.setSize(this.width, this.height)
            })
        }
    }

    validatePos(x, z, arrX, arrZ) {
        var valid = true
         for (var i = 0; i < arrX.length; i++) {
            if (arrX[i] + 6 > x && arrX[i] - 6 < x) {
                valid = false
            }
            if (arrZ[i] + 6 > z && arrZ[i] - 6 < z) {
                valid = false
            }
        }
        return valid
    }

    start () {
        if (this.active === true) return
        this.active = true
        requestAnimationFrame(this.loop.bind(this))
    }

    stop () {
        if (this.active === false) return
        this.active = false
        cancelAnimationFrame(this.loop.bind(this))
    }
  
    render (now, method) {
         const state = {
            renderer: this.renderer,
            scene: this.scene,
            camera: this.camera,
            orbitControls: this.orbitControls
        }

        method(state)
    }

    loop (now) {
        if (this.active === true) {
            requestAnimationFrame(this.loop.bind(this))
        } 
    
        this.render(now, this.main)
    }
}