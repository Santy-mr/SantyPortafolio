import Application from "./Application.js";
import EventEmitter from "../utils/EventEmitter.js";


export default class LoadingScreen extends EventEmitter {
    constructor(){
        super()

        this.application = new Application()
        this.resources = this.application.resources
        this.canvas = this.application.canvas
        this.loadingManager = this.resources.loadingManager

        this.progressBar = document.querySelector('.progress-bar-fill')
        this.progressBarContainer = document.querySelector('.progress-bar-container')
        this.mainSection = document.querySelector('.mainSection')

        this.SetProgress()
        this.SetOnLoad();
    }

    SetProgress(){
        this.loadingManager.onProgress = (url, loaded, total) => {
            const progressPercentage = (loaded / total) * 100
            this.progressBar.style.width = progressPercentage + '%'
            this.progressBar.textContent = Math.floor(progressPercentage) + '%'
        }
    }

    SetOnLoad(){
        this.resources.on('loaded', () => {
            this.progressBarContainer.style.display = 'none'
            this.mainSection.style.display = 'block'
        })
    }
}