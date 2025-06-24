import EventEmitter from "../../utils/EventEmitter.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { SplitText } from "gsap/SplitText";
 
export default class Animations extends EventEmitter {
    constructor() {
        super()
        
        gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText)

        this.smoother = ScrollSmoother.create({
            content: '.smooth-content',
            smooth: .5,
            effects: true
        })

        this.TriggerAnimations();
    }

    TriggerAnimations() {
        this.split = SplitText.create('.entry-header', { type: 'lines, words, chars',})
        
        gsap.from(this.split, {
            opacity: 0,
            delay: 2,
            y: -100,
        })
    }
}