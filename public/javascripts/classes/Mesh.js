class Mesh {
	constructor(){
		this.materials = [];
		this.objects = [];
		this.objects.push(new Obj());
	}
}

class Material {

}

class Obj {
	constructor(objName=undefined){
		if(objName == undefined){
			this.name = "d";
		} else {
			this.name = "o-"+objName;
		}
		this.groups = [];

		this.groups.push(new Group());
	}
}

class Group {
	constructor(gName){
		if(gName == undefined){
			this.name = "d";
		} else {
			this.name = "o-"+gName;
		}
		this.mName = undefined;
		this.pos = new Float32Array([]);
		this.uv = new Float32Array([]);
		this.normal = new Float32Array([]);
	}

	addFace(){
		
	}
}