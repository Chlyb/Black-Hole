class BlackHole{
  constructor(x,y,m){
    this.pos = createVector(x,y);
    this.mass = m;
    this.rs = 2*G*m/c/c;
  }

  attract(p, dt){
    let force = p5.Vector.sub(this.pos, p.pos);
    let a = force.heading();
    let r = force.mag();
    let fg = G * this.mass / (r*r);
    let deltaAng = -fg * dt / c * sin(p.a - a);
    deltaAng /= abs(1.0 - 2.0 * G * this.mass / (r*c*c))
    p.a += deltaAng;

    if(r <= this.rs*1.01)
      p.captured = true;
  }

  show(){
    fill(0);
    noStroke();
    circle(this.pos.x, this.pos.y, this.rs);

    noFill();
    stroke(255,255,0);
    strokeWeight(5);
    circle(this.pos.x, this.pos.y, 1.5 *this.rs);

    stroke(255,100,0);
    circle(this.pos.x, this.pos.y, 3*this.rs);

    strokeWeight(10);
    line(this.pos.x - 3*this.rs, this.pos.y, this.pos.x + 3*this.rs, this.pos.y);
  }
}