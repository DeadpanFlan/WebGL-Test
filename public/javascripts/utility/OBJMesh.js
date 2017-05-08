// ------------------------ //
// --Create Mesh From Obj-- //
// ------------------------ //

function objMesh(url){
	var rf = readFile(url);

	rf.then(
		function(response){
			var lines = response.split("\n");

			// Collect All Vertex info into Arrays
			var VERTEX_RE = /^v\s/;
			var NORMAL_RE = /^vn\s/;
			var TEXTURE_RE = /^vt\s/;
		    var WHITESPACE_RE = /\s+/;
		    var COMMENT_RE = /^#\s/;

		    var all_RE = /^(v\s|vn\s|vt\s|#.*|\s)/

			var vInfo = {}

			vInfo.v = lines.filter(
				function(line){
					return VERTEX_RE.test(line);
				}
			).map(
				function(e){
					return new Float32Array(e.trim().split(WHITESPACE_RE).slice(1));
				}
			);
			

			vInfo.vn = lines.filter(
				function(line){
					return NORMAL_RE.test(line);
				}
			).map(
				function(e){
					return new Float32Array(e.trim().split(WHITESPACE_RE).slice(1));
				}
			);
			vInfo.vt = lines.filter(
				function(line){
					return TEXTURE_RE.test(line);
				}
			).map(
				function(e){
					return new Float32Array(e.trim().split(WHITESPACE_RE).slice(1));
				}
			);

			vInfo.rest = lines.filter(
				function(line){
					return !all_RE.test(line) && line;
				}
			)
			// Tests for specific Lines
			var MTLLIB_RE = /^mtllib\s/;
			var USEMTL_RE = /^usemtl\s/;
			var O_RE = /^o\s/;
			var G_RE = /^g\s/;
			var F_RE = /^f\s/;

			var mesh = new Mesh();

			for(l of vInfo.rest){
				if(MTLLIB_RE.test(l)){
					// Read MTL defined into Materials on Mesh
				}else if( USEMTL_RE.test(l)){
					// put MTL id into mName of group
				}else if( O_RE.test(l)){
					// Create New Object with Object Name
				}else if( G_RE.test(l)){
					// Create New Group with Group Name
					
				}else if( F_RE.test(l)){
					// Add Face to Group
				}
			}

		}
	)
}