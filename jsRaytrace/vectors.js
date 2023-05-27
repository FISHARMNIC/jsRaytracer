class Point {
    x;
    y;
    z;
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    asArray() {
        return [this.x,this.y,this.z]
    }

    distance(point2) {
        return Math.sqrt((this.x - point2.x) * (this.x - point2.x) + (this.y - point2.y) * (this.y - point2.y) + (this.z - point2.z) * (this.z - point2.z))
    }

    copy() {
        return new Point(...this.asArray())
    }

    move(vec) {
        this.x += vec.x;
        this.y += vec.y;
        this.z += vec.z;
    }

    moveBackwards(vec) {
        this.x -= vec.x;
        this.y -= vec.y;
        this.z -= vec.z;
    }
}

class Vector extends Point{

    constructor(x,y,z) {
        super(x,y,z)
    }

    static getVector(point1, point2)
    {
        return new Vector(
            point2.x - point1.x,
            point2.y - point1.y,
            point2.z - point1.z
        );
    }

    static normalize(vec, len)
    {
        return new Vector(
            vec.x/len,
            vec.y/len,
            vec.z/len
        );
    }

    static autoNormalize(vec)
    {
        var absx = Math.abs(vec.x);
        var absy = Math.abs(vec.y);
        var absz = Math.abs(vec.z);
        var max;

        if(absx >= absy && absx >= absz)
        {
            max = absx;   
        } else if (absy >= absz)
        {
            max = absy;
        } else {
            max = absz;
        }


        return Vector.normalize(vec, max)
    }

    static dotProduct(point1, point2)
    {
        return point1.x * point2.x + point1.y * point2.y + point1.z * point2.z;
    }

}

class Light extends Point{
    size;
    constructor(x,y,z,size=20) {
        super(x,y,z);
        this.size = size;
    }

    isColliding(point) {
        return this.distance(point) < this.size;
    }    
}

class Color {
    hue;
    light;
    constructor(hue,lightness = 100) 
    {
        this.hue = hue;
        this.light = lightness;
    }

    toString() {
        return `hsl(${this.hue}, 100%, ${this.light}%)`
    }

    copy() {
        return new Color(this.hue,this.light)
    }
}