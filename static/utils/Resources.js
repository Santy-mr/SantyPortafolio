import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;
    }

    SetLoaders() {
        this.loaders = {
            gltfLoader: new GLTFLoader(),
            textureLoader: new THREE.TextureLoader()
        }
    }

    StartLoading() {
        for (const source of this.sources) {
            switch (source.type) {
                case 'texture':
                    this.loaders.textureLoader.load(
                        source.path, (file) => {
                            this.sourceLoaded(source, file);
                        }
                    )
                break;

                case 'gltf':
                    this.loaders.gltfLoader.load(
                        source.path, (file) => {
                            this.sourceLoaded(source, file);
                        }
                    )
                break;

                default:
                    console.log("No existe ningun archivo de este tipo");

            }
        }
    }

    SourceLoaded(source, file) {
        this.items[source.name] = file;
        this.loaded++;

        if (this.loaded === this.toLoad) {
            this.trigger('loaded');
        }
    }

}