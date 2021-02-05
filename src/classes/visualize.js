const THREE = require('three')
import Sync from './sync'
import Animate from './animate'

export default class Visualize {
    constructor ({ volumeSmoothing = 100, hidpi = true }) {
        this.sync = new Sync({ volumeSmoothing })

        this.animate = new Animate({
            main: this.render.bind(this),
            hidpi
        })

        this.watch()
        this.hooks()
    }

    watch() {
        this.sync.watch('active', val => {
            if (val === true) {
                this.animate.start()
            } else {
                this.animate.stop()
            }
        })
    }

    hooks() {

    }

    render() {

    }
}