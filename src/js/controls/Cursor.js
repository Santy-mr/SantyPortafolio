import EventEmitter from "../../utils/EventEmitter.js"

export default class Cursor extends EventEmitter{
    constructor(application){
        super()

        this.application = application

        this.sizes = this.application.sizes

        this.cursor = {
            x: 0,
            y: 0
        }

        window.addEventListener('mousemove', (e) => {
            this.cursor.x = (e.clientX / this.sizes.width) - 0.5
            this.cursor.y = (e.clientY / this.sizes.height) - 0.5
        })
    }
}