import EventEmitter from "../static/utils/EventEmitter.js";
import Application from "./Application.js";
import gsap from "gsap";

export default class Scroll extends EventEmitter {
    constructor() {
        super()

        this.application = new Application()

        this.sizes = this.application.sizes
        this.sectionMeshes = this.application.world.environment.sectionMeshes

        this.scroll = {}
        this.scroll.Y = window.scrollY
        this.currentSection = 0
    }

    Update(){
        window.addEventListener('scroll', () => {
            this.scroll.Y = window.scrollY;
            this.newSection = Math.round(this.scroll.Y / this.sizes.height)

            if (this.newSection != this.currentSection) {
                this.currentSection = this.newSection
                gsap.to(this.sectionMeshes[this.currentSection].rotation, {
                    duration: 1.5,
                    ease: 'power2.inOut',
                    x: '+=6',
                    y: '+=3',
                    z: '+=1.5'
                })
            }
        })
    }
}