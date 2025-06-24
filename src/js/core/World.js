import Environment from "../rendering/Environment.js"
import Scroll from "../controls/Scroll.js"
import Cursor from "../controls/Cursor.js"
import Astronaut from "../scene/models/Astronaut.js"
import Planets from "../scene/models/Planets.js"

export default class World {
    constructor(application) {
        this.application = application

        this.scroll = new Scroll(this.application)
        this.cursor = new Cursor(this.application)
        
        this.scene = this.application.scene
        this.resources = this.application.resources
        this.debug = this.application.debug

        this.resources.on('loaded', () => {
            this.astronaut = new Astronaut(this.application)
            this.planet = new Planets(this.application)

            if(this.debug.active){
                this.animFolders = this.debug.ui.addFolder("Objects")
                this.animFolders.add(this.astronaut, 'speedAstronautAnim', 0, 0.001, 0.0001)
                this.animFolders.add(this.planet, 'speedPlanetAnim', 0, 0.001, 0.0001)
            }

            this.environment = new Environment(this.application, this.astronaut, this.planet);
            this.environment.sectionMeshes ?  this.scroll.SetSectionMeshes(this.environment.sectionMeshes) : null;
        })
    }

    Update() {
        if (this.environment) {
            this.environment.Update();
            this.astronaut ? this.astronaut.Update() : null
            this.planet ? this.planet.Update() : null
        }
    }
}