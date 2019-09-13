var photons = [];

class Photon{
  constructor(x,y,a){
    this.pos = createVector(x,y);
    this.a = a;
    this.captured = false;
    this.path = [];
    photons.push(this);
  }

  update(dt){
    //if(this.pos.x < 0 || this.pos.x > windowWidth) this.captured = true;
    if(this.pos.x < 0) this.captured = true;
    if(this.pos.y < 0 || this.pos.y > windowHeight) this.captured = true;

    if(!this.captured) {
      this.pos.add(createVector(c*dt,0).rotate(this.a) );
      this.path.push(this.pos.copy());
    }
  }

  show(){
    strokeWeight(1);
    stroke(255,0,0);
    point(this.pos.x,this.pos.y);
  }
}