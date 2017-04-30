const YAW        = -90.0;
const PITCH      =  0.0;
const SPEED      =  3.0;
const SENSITIVTY =  0.25;
const ZOOM       =  45.0;

class Camera {
	constructor(pos=[0.0,0.0,0.0], up=[0.0,1.0,0.0],y=YAW, p=PITCH){
		this.Position = vec3.fromValues(pos[0],pos[1],pos[2]);
        this.WorldUp = vec3.fromValues(up[0],up[1],up[2]);
        this.Yaw = y;
        this.Pitch = p;
        this.updateCameraVectors();
	}

	updateCameraVectors(){
		var front = vec3.create();
		this.Front = vec3.create();
		this.Right = vec3.create();
		this.Up = vec3.create();

		front[0] = Math.cos(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch));
		front[1] = Math.sin(glMatrix.toRadian(this.Pitch));
		front[2] = Math.sin(glMatrix.toRadian(this.Yaw)) * Math.cos(glMatrix.toRadian(this.Pitch))
		
		vec3.normalize(this.Front, front);
		// Cross Front and WorldUp
		var tmp1 = vec3.create();
		vec3.cross(tmp1,this.Front,this.WorldUp);
		vec3.normalize(this.Right, tmp1);
		// Cross Right and Front
		var tmp2 = vec3.create();
		vec3.cross(tmp2, this.Right, this.Front);
		vec3.normalize(this.Up, tmp2);

	}

	processMouseMovement(xOff,yOff, constrainPitch=true){
		var xOffset = xOff * SENSITIVTY;
		var yOffset = yOff * SENSITIVTY;

		this.Yaw += xOffset;
		this.Pitch += yOffset

		if(constrainPitch){
			if (this.Pitch > 89.0){

                this.Pitch = 89.0;
			}
            if (this.Pitch < -89.0){
                this.Pitch = -89.0;
            }
		}
		this.updateCameraVectors();
	}

	processKeyboard(direction, deltaTime)
    {
        // var velocity = SPEED * deltaTime;
        var velocity = SPEED * deltaTime/1000;
        if (direction == "F"){
        	var tmp = vec3.create();
        	vec3.scale(tmp,this.Front, velocity);
        	vec3.add(this.Position, this.Position, tmp);
            // this.Position += vec3.mul(this.Front, * velocity;
        }
        if (direction == "B"){
        	var tmp = vec3.create();
        	vec3.scale(tmp,this.Front, velocity);
        	vec3.sub(this.Position, this.Position, tmp);
            // this.Position -= this.Front * velocity;
        }
        if (direction == "L"){
        	var tmp = vec3.create();
        	vec3.scale(tmp,this.Right, velocity);
        	vec3.sub(this.Position, this.Position, tmp);
            // this.Position -= this.Right * velocity;
        }
        if (direction == "R"){
        	var tmp = vec3.create();
        	vec3.scale(tmp,this.Right, velocity);
        	vec3.add(this.Position, this.Position, tmp);
            // this.Position += this.Right * velocity;
        }
    }

	getViewMatrix(){
		var ret = mat4.create();
		var eye = vec3.create();

		vec3.add(eye,this.Position, this.Front);
		mat4.lookAt(ret,this.Position,eye, this.Up)

		return ret;
	}



}