const c = 30;
const G = 3;

var bh;
var camDir;
var camPos;

const size = 400;

function setup() {
  //createCanvas(windowWidth, windowHeight);
  createCanvas(size, size);

  bh_x = 0.25*width;
  bh_y = height/2;
  bh = new BlackHole(bh_x, bh_y, 4000);

  /*
  let x = 0.75 * windowWidth;
  for(let y = windowHeight/4; y < windowHeight/2; y +=2){
    new Photon(x , y, PI);
  }*/

  camPos = createVector(width, height/2 - 20);

  camDir = p5.Vector.sub(bh.pos, camPos);

  let a0 = camDir.heading();
  let am = a0 +1/6 * PI;

  let da = (am - a0)/width/sqrt(2)*2*0.99;

  for(let a = a0 ; a < am; a += da){
    new Photon(camPos.x, camPos.y,a);
  }
  print(photons.length);
  print(width);

  camDir.normalize();
  
  ellipseMode(RADIUS);

  background(255);
  bh.show();

  let t = 0;
  let dt = 0.1;
  while(t < 50){
    t += dt;

    for(let p of photons){
      bh.attract(p, dt);
      p.update(dt);
      p.show();
    }
  }

  render();
  //raytrace(0,200);
}

function render(){
  background(0);
  loadPixels();
  for(let y = 0; y < height; y++)
    for(let x = 0; x < width; x++){
      let i = 4*(y*width + x);

      let r = raytrace(x,y);

      pixels[i] = red(r);
      pixels[i + 1] = green(r);
      pixels[i + 2] = blue(r);
      pixels[i + 3] = alpha(r);
    }
  updatePixels(); 
}

function raytrace(pixel_x,pixel_y){
  let rel_x = pixel_x - width/2;
  let rel_y = pixel_y - height/2;
  let pixelPos = createVector(rel_x, rel_y);
  let photon = photons[ Math.round(pixelPos.mag())];
  //return color(pixelPos.mag());
  let angle = -pixelPos.heading();
  angle -= HALF_PI;
  //return color( sin(angle)*255);
  let cosine = cos(angle);
  let sine= sin(angle);

  var xt1 = (camDir.x*camDir.y*(1-cosine)-camDir.z*sine);
  var xt2 = (cosine + camDir.x*camDir.x*(1-cosine));

  var yt1 = (cosine + camDir.y*camDir.y*(1-cosine));
  var yt2 = (camDir.x*camDir.y*(1-cosine)+camDir.z*sine);

  var zt1 = (camDir.z*camDir.y*(1-cosine)+camDir.x*sine);
  var zt2 = (camDir.z*camDir.x*(1-cosine)-camDir.y*sine);

  let hit = "sky";
  var dis;

  for(let pos of photon.path){

    let v = pos.copy().sub(camPos);
    let d = v.dot(camDir);
    let linePoint = camPos.copy().add(camDir.copy().mult(d));
    let off = pos.copy().sub(linePoint);

    let x = xt1 * off.y + xt2 * off.x;
    let y = yt1 * off.y + yt2 * off.x;
    let z = zt1 * off.y + zt2 * off.x;

    let pos3d = createVector(x,y,z);
    pos3d.add(linePoint);
    //point(pos3d.x,pos3d.y);
    
    disSq = p5.Vector.sub(bh.pos, pos3d).magSq();

    //print(pos3d.x.toFixed()+ " " + pos3d.y.toFixed() + " " + pos3d.z.toFixed());
    if (disSq <= bh.rs*bh.rs *1.02 ){
      hit = "hole";
      break;
    }
  
    if(pos3d.y < bh.pos.y + 3 && pos3d.y > bh.pos.y - 3)
    if( (pos3d.x-bh.pos.x)*(pos3d.x-bh.pos.x) + (pos3d.y-bh.pos.y)*(pos3d.y-bh.pos.y) < 9*bh.rs*bh.rs) {
      hit = "disk";
      break;
    }
  }

  if(hit == "disk") {
    let inner = color(255, 150, 0);
    let outer = color(255,100,0);

    return lerpColor(inner, outer, disSq / bh.rs / bh.rs / 9);
  }

  if(hit == "hole") return color(0);
  return color(10);
}


//let t = 0;
/*
function draw() {
  let dt = 0.1;
  //t += dt;
  //print(t);

  for(let p of photons){
    bh.attract(p, dt);
    p.update(dt);
    p.show();
  }

}
*/

  
