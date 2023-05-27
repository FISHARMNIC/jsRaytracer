const CANV_WIDTH = 500;
const CANV_HEIGHT = 500;

const RENDER_WIDTH = 100;
const RENDER_HEIGHT = 100;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// maximum render distance
const RENDER_DISTANCE = -1000;

// maximum time the ray will live after the first collision
const RAY_LIFESPAN = 100;

const AMBIENT_LIGHT = 30;

// makes rays travel faster, the higher, the lower the quality
const QUALITY = 2;