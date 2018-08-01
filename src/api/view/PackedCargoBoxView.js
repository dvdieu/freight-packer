import CargoBoxView from "./CargoBoxView";
import BoxEntry from "../components/box/BoxEntry";

const unitCubeEdgeGeometry = new THREE.EdgesGeometry(new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1));
const wireframeMaterialTemplate = new THREE.LineBasicMaterial({color: 0xffffff});

class PackedCargoBoxView extends CargoBoxView {
    /**
     * @param {BoxEntry} boxEntry 
     */
    constructor(boxEntry){
        super(boxEntry);

        var meshMaterial = this.mesh.material;
        meshMaterial.polygonOffset = true;
        meshMaterial.polygonOffsetFactor = 1;
        meshMaterial.polygonOffsetUnits = 1;
        meshMaterial.transparent = true;
        meshMaterial.opacity = .5;

        this.mesh.castShadow = this.mesh.receiveShadow = true;

        var material = wireframeMaterialTemplate.clone();
        this.wireMesh = new THREE.LineSegments(unitCubeEdgeGeometry, material);
        this.wireMesh.scale.copy(boxEntry.dimensions.vec3);

        this.view.add(this.wireMesh);
    }

    /** @returns {BoxEntry} */
    get entry(){ return super.entry; }
    set entry(value){
        super.entry = value;
        this.scale = value.dimensions.vec3;
    }

    /**
     * @param {Number} x 
     * @param {Number} y 
     * @param {Number} z 
     */
    SetScale(x, y, z){
        this.mesh.scale.set(x, y, z);
        this.wireMesh.scale.set(x, y, z);
    }

    /**
     * @param {Number} x in radians
     * @param {Number} y in radians
     * @param {Number} z in radians
     */
    SetRotationAngles(x, y, z){
        this.mesh.rotation.set(x, y, z);
        this.wireMesh.rotation.set(x, y, z);
    }

    /**
     * @param {CargoBoxView} cargoView 
     */
    Extend(cargoView){
        this.entry = cargoView.entry;
        this.mesh.material.color = cargoView.mesh.material.color;
    }
}

export default PackedCargoBoxView;