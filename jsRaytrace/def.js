const CANV_WIDTH = 500;
const CANV_HEIGHT = 500;

var res_slider = document.getElementById("res");

var RENDER_WIDTH = res_slider.value;
var RENDER_HEIGHT = res_slider.value;

res_slider.oninput = function() {
    RENDER_WIDTH = this.value;
    RENDER_HEIGHT = this.value;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// maximum render distance
const RENDER_DISTANCE = -1000;

// maximum time the ray will live after the first collision
const RAY_LIFESPAN = 100;

// number of bounces
var bounces_slider = document.getElementById("bounces");
var MAX_BOUNCES = bounces_slider.value;
bounces_slider.oninput = function() {
    MAX_BOUNCES = this.value
    document.getElementById("bounces_out").innerText = MAX_BOUNCES;
}



const AMBIENT_LIGHT = 20;

// makes rays travel faster, the higher, the lower the quality
const QUALITY = 2;
