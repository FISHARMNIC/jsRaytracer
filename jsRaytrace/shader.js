var sphere_image;
var sphere_data = [];

var shader_canvas = document.createElement('canvas');
var shader_context = canvas.getContext('2d', { willReadFrequently: true });

function shader_init() {

    var image_width = 200
    var image_height = 200;
    sphere_image = new Image(image_width, image_height);
    sphere_image.src = "smiley.png";
    sphere_image.hidden = true;

    document.body.append(sphere_image)

    shader_canvas.width = 1;
    shader_canvas.height = 1;

    var imageLoss = 20

    sphere_image.onload = async function () {
        for (var y = 0; y <= image_width; y += 1) {
            sphere_data[y] = []
            for (var x = 0; x <= image_height; x += imageLoss) {
                shader_context.drawImage(sphere_image, x, y, 1, 1, 0, 0, 1, 1);
                var out = shader_context.getImageData(0, 0, 1, 1).data
                for(var i = 0; i < imageLoss; i++)
                    sphere_data[y][x+i] = out
            }
        }
    }

}

function renderStyle(x)
{
    render_mode = x
}

function sphereShader(x, y, z, radius) {
    //shader_canvas.width = 1;
    //shader_canvas.height = 1;
    var dbrad = 2 * radius;
    //shader_context.drawImage(sphere_image,(x+radius)/dbrad * 200,(y+radius)/dbrad * 200,1,1,0,0,1,1);
    //var out = shader_context.getImageData(0,0,1,1).data

    var zOffset = z/radius * 5
    var rendX = Math.floor((x + radius) / dbrad * 200 + zOffset);
    var rendY = Math.floor((y + radius) / dbrad * 200 + zOffset);

    var out = sphere_data[rendY][rendX]
    if(out == undefined) {
        return 0
    }
    return out[0];
}