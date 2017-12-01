import * as THREE from 'three';
import png_disk128 from '../assets/disk128.png'
import png_disk32 from '../assets/disk32.png'

const _loader = new THREE.TextureLoader();

const TextureLoader = {
    loader: _loader,

    disk128: _loader.load(png_disk128),
    disk32: _loader.load(png_disk32)
}

export default new TextureLoader;