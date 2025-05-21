import Application from "./Application.js";
import EventEmitter from "../utils/EventEmitter";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default class Animations extends EventEmitter {
    constructor() {
        super()

        gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

        this.smoother = ScrollSmoother.create({
            content: '.smooth-content',
            smooth: .5,
            effects: true
        })
    }
}