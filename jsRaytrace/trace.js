canvas.style.width = CANV_WIDTH + "px";
canvas.style.height = CANV_HEIGHT + "px";
canvas.width = CANV_WIDTH;
canvas.height = CANV_HEIGHT;

//note: switch colors to rgba instead?

var render_objects = [
    // x,y,z,size,Color(hue,lightness)
    new Sphere(90, 300, 0, 110, new Color(50, 100)),
    new Sphere(300, 250, 0, 100, new Color(10, 100)),
    new Sphere(170, 120, 0, 75, new Color(80, 100)),
    //new Plane(250, 250, 25, 100, new Color(80, 100))
];

var lights = [
    // x,y,z,size
    new Light(0, 0, 100, 50)
];

canvas.addEventListener('mousemove', (event) => {
    lights[0].x = event.clientX
    lights[0].y = event.clientY
    //render_objects[0].x = event.clientX
    //render_objects[0].y = event.clientY
    run()
});

shader_init()

// x,y,z
var camera = new Point(0, 0, 200);

function run() {

    var resolutionX = CANV_WIDTH / RENDER_WIDTH;
    var resolutionY = CANV_HEIGHT / RENDER_HEIGHT;

    ctx.clearRect(0, 0, CANV_WIDTH, CANV_HEIGHT);

    for (camera.y = 0; camera.y < CANV_HEIGHT; camera.y += resolutionY) {
        for (camera.x = 0; camera.x < CANV_WIDTH; camera.x += resolutionX) {

            /* 
            We start of casting a ray in the z direction
            -> If we hit something, begin calculating bounces and the color to display
            */
            var closestZ = RENDER_DISTANCE;
            var collisionObj;
            render_objects.forEach(e => {
                var intercept = e.zIntercept(camera.x, camera.y);

                if (intercept != null && intercept > closestZ) {
                    closestZ = intercept;
                    collisionObj = e;
                }
            })
            // If hit something
            if (closestZ > RENDER_DISTANCE) {
                // returns the color
                var collisionPoint = new Point(camera.x, camera.y, closestZ)
                var outcol = collidedWithObject({ collisionPoint: collisionPoint.copy(), closestZ, collisionObj, camera })
                outcol.light += shadows({collisionObj, collisionPoint})
                ctx.fillStyle = outcol.toString()
                ctx.fillRect(camera.x, camera.y, resolutionX, resolutionY);
            }
        }
    }
    //console.log("done")
}

function collidedWithObject({ collisionPoint, closestZ, collisionObj, camera }) {
    // Set the pixel color to our first collision
    // Note: any further bounce will change this
    
    //var return_color = collisionObj.color.copy();

    // gets the color at the collision point
    var return_color = collisionObj.colorAtPoint(collisionPoint);
    
    // We haven't hit a light yet
    return_color.light = AMBIENT_LIGHT;

    // we start at the collision
    var rayPosition = collisionPoint
    // The direction out ray should go now
    var rayVector = collisionObj.bounceAngle(rayPosition, Vector.getVector(camera, collisionPoint));
    // The vector will have varing magnitudes based on it's collision, normalize it so we dont travel to fast
    rayVector = Vector.autoNormalize(rayVector)

    // Move the ray away from the collision object a bit so we dont register a second collision by accident
    rayPosition.move(rayVector)


    // duplicate our lights list
    var allLights = lights.slice(0)
    var noLightHits = true;

    for (var age = 0; age < RAY_LIFESPAN; age++) {

        var bounces = 0
        // Check collision for any object
        
        render_objects.every(element => {
            //stop after max bounces
            if(bounces >= MAX_BOUNCES) return false

            // If we collide with any object
            if (element.isColliding(rayPosition)) {
                // re-orient our ray
                rayVector = element.bounceAngle(rayPosition, rayVector)
                rayVector = Vector.autoNormalize(rayVector)
                
                //return_color.hue = element.color.hue
                
                // copy the hue of the collision point
                return_color.hue = element.colorAtPoint(collisionPoint).hue
                return false
            }

            bounces++
            return true
        })

        // Check collision for any light source
        allLights.forEach((light, ind) => {
            // If we hit the light
            var d = light.distance(rayPosition);
            if (d < light.size) {
                noLightHits = false;
                return_color.light = (110 + AMBIENT_LIGHT) - (d / light.size * 100)
                //blacklist this light for the current pixel, we dont want to add up the same light
                allLights.splice(ind, 1)
            }
        })

        // keep moving
        rayPosition.move(rayVector)
    }


    return return_color

}


// This is temporary, try to incorporate this into the other function
function shadows({ collisionObj, collisionPoint }) {
    collisionPoint.z += 0.3;
    var lightamt = 0;
    lights.forEach(light => {
        // Get the vector from the collision point to the light 
        var movement_vector = Vector.getVector(collisionPoint, light);
        var movement_vector = Vector.autoNormalize(movement_vector)
        var position = collisionPoint.copy()
        var noCollision = true;

        // move along the path until we reach the light
        while (!light.isColliding(position)) {
            // Check collision for any object
            render_objects.forEach(element => {
                // If we collide with any object
                // compare pointers and exclude if touching the same obj
                if ( element.isColliding(position)) {
                    noCollision = false;
                   // break;
                }
            })

            position.move(movement_vector)
        }

        if(noCollision) lightamt += 20;
    })
    return lightamt;
}


//Shadow bounce test
//something is wrong with this: the shadows are square and not bouncing
function shadows2({ collisionObj, collisionPoint }) {
    collisionPoint.z += 1;
    var lightamt = 0;
    lights.forEach(light => {
        // Get the vector from the collision point to the light 
        var movement_vector = Vector.getVector(collisionPoint, light);
        movement_vector = Vector.autoNormalize(movement_vector)

        var position = collisionPoint.copy()

        // move along the path until we reach the light or time out
        var age = 0
        while (!light.isColliding(position) && age < RAY_LIFESPAN) {
            // Check collision for any object
            render_objects.forEach(element => {
                // If we collide with any object
                // compare pointers and exclude if touching the same obj
                if (element.isColliding(position)) 
                {
                    movement_vector = element.bounceAngle(position, movement_vector);
                    movement_vector = Vector.autoNormalize(movement_vector)
                    position.move(movement_vector)
                }
            })

            position.move(movement_vector)
            age++
        }

        if(light.isColliding(position)) lightamt += 5;
    })
    return lightamt;
}