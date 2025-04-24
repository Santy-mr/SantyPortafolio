import Model from "./Models.js";


export default class Planets extends Model {
    constructor(){
        super("planetModel")
        this.speedPlanetAnim = 0.0001
    }

    Update() {
        this.model.rotation.y += this.time.delta * this.speedPlanetAnim
    }
}