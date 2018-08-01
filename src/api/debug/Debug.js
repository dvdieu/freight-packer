import AFitTest from "../packer/afit/AFitTest";

function delay(time, callback){
    setTimeout(callback, time);
}

const debugGeometry = new THREE.BoxBufferGeometry(1, 1, 1, 1, 1, 1);
const debugMaterial = new THREE.MeshStandardMaterial({color: 0xff7f00, transparent: true, opacity: .35});
const debugBox = new THREE.Mesh(debugGeometry, debugMaterial);

var tempVec = new THREE.Vector3();

class DebugBox {

    /**
     * @param {THREE.Vector3} center 
     * @param {Number|THREE.Vector3} size 
     */
    static FromCenterSize(center, size){
        var box = debugBox.clone();
        box.position.copy(center);
        
        if(size instanceof THREE.Vector3)
            box.scale.copy(size);
        else
            box.scale.set(size, size, size);

        return box;
    }

    /**
     * @param {THREE.Box3} box3 
     */
    static FromBox3(box3){
        var box = debugBox.clone();

        box3.getCenter(tempVec);
        box.position.copy(tempVec);
        box3.getSize(tempVec);
        box.scale.copy(tempVec);

        return box;
    }
}

/**
 * DebugViz
 */

/** @type {THREE.Object3D} */
var view;

/** @type {Map<string, *>} */
var debugObjects = new Map();

var tVec3 = new THREE.Vector3(),
    tPos = new THREE.Vector3(),
    tScale = new THREE.Vector3();

class DebugViz {

    /**
     * @param {THREE.Object3D} parent
     */
    static SetViewParent(parent){
        view = new THREE.Object3D();
        view.name = 'DebugViz view';
        view.renderOrder = Number.MAX_SAFE_INTEGER - 10;
        parent.add(view);
    }

    static get view(){ return view; }

    /**
     * @param {Number} x center x * @param {Number} y center y * @param {Number} z center z * @param {Number} w * @param {Number} h * @param {Number} l
     * @param {Number} [color] hex color
     * @param {Number} [duration] in milliseconds
     */
    static DrawVolume(x, y, z, w, h, l, color, duration){
        tPos.set(x, y, z);
        tScale.set(w, h, l);

        /** @type {THREE.Mesh} */
        var volume = debugBox.clone();
        view.add(volume);

        volume.position.copy(center);

        if(color){
            /** @type {THREE.MeshStandardMaterial} */
            let material = volume.material;
            material.color.setHex(color);
        }

        let uid = THREE.Math.generateUUID();
        debugObjects.set(uid, volume);

        if(duration){
            delay(duration, function(){
                DebugViz.RemoveObjectByUID(uid);
            });
        }

        return uid;
    }

    /**
     * @param {string} uid 
     */
    static RemoveObjectByUID(uid){
        var object = debugObjects.get(uid);
        if(object instanceof THREE.Object3D && object.parent){
            object.parent.remove(object);
        }
    }
}

/**
 * DebugViz
 */

class Debug {

    static get AFitTest(){
        return AFitTest;
    }

    static get CLPTest(){
        return require('../packer/clp/CLPTest');
    }
}

Debug.Box = DebugBox;
Debug.Viz = DebugViz;

export default Debug;