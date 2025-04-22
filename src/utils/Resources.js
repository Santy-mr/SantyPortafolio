import * as THREE from "three";
import { DRACOLoader, GLTFLoader, RGBELoader } from 'three/examples/jsm/Addons.js'
import EventEmitter from "./EventEmitter.js";

export default class Resources extends EventEmitter {
    constructor(sources) {
        super();

        this.sources = sources;

        this.items = {};
        this.toLoad = this.sources.length;
        this.loaded = 0;

        this.loadingManager = new THREE.LoadingManager()

        this.SetLoaders()
        this.StartLoading()
    }

    SetLoaders() {
        this.loaders = {
            gltfLoader: new GLTFLoader(this.loadingManager),
            textureLoader: new THREE.TextureLoader(this.loadingManager),
            dracoLoader: new DRACOLoader(this.loadingManager),
            rgbeLoader: new RGBELoader(this.loadingManager)
        }
        this.loaders.dracoLoader.setDecoderPath("/draco/")
        this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
    }

    StartLoading() {
        for (const source of this.sources) {
            switch (source.type) {
                case 'texture':
                    this.loaders.textureLoader.load(
                        source.path, (file) => {
                            this.SourceLoaded(source, file);
                        }
                    )
                break;

                case 'gltf':
                    this.loaders.gltfLoader.load(
                        source.path, (file) => {
                            this.SourceLoaded(source, file);
                        }
                    )
                break;

                case 'hdr':
                    this.loaders.rgbeLoader.load(
                        source.path, (file) => {
                            this.SourceLoaded(source, file)
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

        this.loadingManager.onLoad = (() => {
            this.trigger('loaded');
        })
    }

}