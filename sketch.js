var points;
var max_points;
var factor;
var addSpeed;
var r;
var offsetX;
var offsetY;
var Outer_Circle_Width;
var Follow_Speed;
var minDim;

function setup() {
  createCanvas(400, 400);
  minDim = min(width, height);
  points = 420 //int(minDim / 1.6);
  max_points = 1000;
  factor = 0;
  addSpeed = 0.01;
  r = minDim / 2 * 0.9
  offsetX = 0;
  offsetY = 0;
  Outer_Circle_Width = 4;
  Follow_Speed = 0.15;
  textFont('calibri');
  textSize(minDim / 20);
}

function getVector(index) {
  var angle = map(index % points, 0, points, 0, TWO_PI);
  var v = p5.Vector.fromAngle(angle + PI / 2, r);
  return v;
}

function circle(x, y, r) {
  ellipse(x, y, r, r);
}

function logx(y, x) {
  return log(y) / log(x);
}

function log10(y) {
  return logx(y, 10);
}

function maplog(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var outMinLog = log(out_min);
  var outMaxLog = log(out_max);
  var scale = (outMaxLog - outMinLog) / (in_max - in_min);
  var res = exp(outMinLog + scale * (value - in_min));
  return withinBounds ? constrain(res, out_min, out_max) : res;
}

function mappow(value, in_min, in_max, out_min, out_max, power, withinBounds = false) {
  var pitch = map(value, in_min, in_max, 0, 1);
  var powered = pow(pitch, power);
  return map(powered, 0, 1, out_min, out_max, withinBounds);
}

function mapu(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var pitch = map(value, in_min, in_max, -1, 1);
  var powered = pow(pitch, 2);
  return map(powered, 0, 1, out_min, out_max, withinBounds);
}

function maps(value, in_min, in_max, out_min, out_max, withinBounds = false) {
  var pitch = map(value, in_min, in_max, -1, 1);
  var powered = pow(pitch, 3);
  return map(powered, -1, 1, out_min, out_max, withinBounds);
}

function toFixed(value, maxDecimals) {
  return round(value * pow(10, maxDecimals)) / pow(10, maxDecimals);
}

function draw() {
  background(25);

  //points = int(map(mouseX, 0, width, 0, max_points));

  factorAdd = -1 * float(maps(mouseX, 0, width, -addSpeed, addSpeed, true));
  factor += factorAdd;
  //print("factorAdd " + factorAdd + ", " + mouseX);

  colorMode(HSB, 255);
  var color = map(abs(factor % (addSpeed * 1000)), 0, (addSpeed * 1000), 0, 255);
  translate(width / 2, height / 2);
  stroke(color, map(mouseY, 0, height, 120, 200, true), 255);
  noFill();

  var lowOff = 10;
  var highOff = -10;

  var targetOffsetX = map(mouseX, 0, width, lowOff, highOff, true);
  var targetOffsetY = map(mouseY, 0, height, lowOff, highOff, true);

  offsetX = lerp(offsetX, targetOffsetX, Follow_Speed);
  offsetY = lerp(offsetY, targetOffsetY, Follow_Speed);

  circle(offsetX, offsetY, r * 2);

  //for	(var i = 0; i < points; i++) {
  //	var v = getVector(i);
  //	fill(color, 200, 255);
  //	circle(v.x + offsetX, v.y + offsetY, Outer_Circle_Width);
  //}

  for (i = 0; i < points; i++) {
    var a = getVector(i);
    var b = getVector(i * factor);
    line(a.x + offsetX, a.y + offsetY, b.x + offsetX, b.y + offsetY);
  }

  textAlign(LEFT);
  var showInfo = mouseY > height * 0.9;
  if (showInfo) {
    //text('offsetX: ' + toFixed(offsetX, 2), 0 - r, height/2 - 55);
    //text('speed: ' + toFixed(factorAdd, 3), 0 - r + offsetX/6 , height/2 - 40 + offsetY/6);
    text('factor: ' + toFixed(factor, 4), 0 - r + offsetX / 6, height / 2 - minDim / 60 + offsetY / 6);
    textAlign(RIGHT);
    text('points: ' + toFixed(points, 3), r + offsetX / 6, height / 2 - minDim / 60 + offsetY / 6);
  } else {
    text('> more info', 0 - r + offsetX / 6, height / 2 - minDim / 60 + offsetY / 6);
  }
}