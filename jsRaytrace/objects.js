/*
Every rendered object must be a child of RenderObj
They must have the following functions:
1) isColliding: given(Point) know if a point is inside of the object
2) zIntercept: given(x,y) calculate where the z point of the object will be, this is done on the first ray casted
3) calculateColorAt(relativeX, relativeY) shader for the sphere, return the color

*/

var render_mode = 1;

class RenderObj {
    x;
    y;
    z;
    color;

    constructor(x,y,z, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color
    }
    
    static radians(angle) {
        return angle * (Math.PI / 180)
    }

    toPoint() {
        return new Point(this.x,this.y,this.z)
    }

    colorAtPoint(point) {
        return this.calculateColorAt(...Vector.getVector(this.toPoint(), point).asArray()).copy()
    }

}

class Sphere extends RenderObj {
    rad;

    constructor(x,y,z,rad,color = "red") {
        super(x,y,z,color);
        this.rad = rad;
    }

    zIntercept(rend_x,rend_y) {
        var rx = rend_x - this.x;
        var ry = rend_y - this.y;
        
        if(rx < -this.rad || rx > this.rad || ry < -this.rad || ry > this.rad)
            return null;
        
        return this.z + Math.sqrt(this.rad * this.rad - ((rx * rx) + (ry *ry)));
    }

    // collisionPoint: where the ray hit the sphere
    // ray_vector: the vector of the ray that hit the sphere
    bounceAngle(collisionPoint, ray_vector)
    {
        //collisionPoint = ray x,y,z
        // c2i = ray_vector
        
        // vector form the center of the circle to the point where the ray collided
        var sphere2int_vector = Vector.getVector(this.toPoint(), collisionPoint);
        
        // normalize the vector the the radius of the sphere
        sphere2int_vector = Vector.normalize(sphere2int_vector, this.rad);

        //  r=d−2(d⋅n)n where n is the normalized normal
        //2(d⋅n)
        var dotProductDoubled = 2 * Vector.dotProduct(ray_vector,sphere2int_vector);

        return new Vector(
            ray_vector.x - (sphere2int_vector.x * dotProductDoubled),
            ray_vector.y - (sphere2int_vector.y * dotProductDoubled),
            ray_vector.z - (sphere2int_vector.z * dotProductDoubled)
        )
    }

    isColliding(point)
    {
        return point.distance(this.toPoint()) <= this.rad
    }

    calculateColorAt(relX,relY,relZ)
    {
        if(render_mode == 1) {
            return this.color
        }
        else if(render_mode == 2) {
            var hue = 0;
            console.log(relX,relY);
            hue += relX < 0 ? 30 : 0;
            hue += relY < 0 ? 70 : 10;
            return new Color(hue, this.color.light)
        } else if(render_mode == 3) {
            var hue = relX/this.rad * 100 + relY/this.rad * 100
            return new Color(hue, this.color.light)
        } else {
            return new Color(sphereShader(relX,relY,relZ,this.rad), this.color.light)
        }
        //shader1
        // var hue = 0;
        // console.log(relX,relY);
        // hue += relX < 0 ? 30 : 0;
        // hue += relY < 0 ? 70 : 10;

        //shader2
        //var hue = relX/this.rad * 100 + relY/this.rad * 100
        //return new Color(hue, this.color.light)

    

    }
}

class Plane extends RenderObj
{
    slope;
    rotation;
    depth;
    constructor(x,y,rotation,depth,color)
    {
        super(x,y,0,color);
        this.rotation = rotation;
        this.depth = depth;
        this.slope = Math.atan(RenderObj.radians(rotation));
    }
    zIntercept(rend_x,rend_y) {
        var int = (rend_y - this.y) / this.rotation;
        if(int > this.depth) return null
        return int
    }

    isColliding(point) {
        return false
    }

    bounceAngle(collisionPoint, ray_vector)
    {
        return ray_vector
    }
}