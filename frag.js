var fragCode = `
  precision mediump float;

  #define PI 3.1415926535897932384626433832795

  #define G 3.0
  #define c 30.0

  #define dt 0.01

  uniform float m;
  uniform vec3 cam_pos;
  varying vec2 coord;  
  uniform float fovH;
  uniform float fovV;

  float angleBetween(vec3 a, vec3 b){
    float d = dot(normalize(a),normalize(b));
    if(d > 1.0)
      d = 1.0;
    if(d < -1.0)
      d = -1.0;
    return acos(d);
  }

  void main(void) { 
    float rs = 2.0*G*m/c/c;
    
    vec3 cam_dir = normalize(-cam_pos);

    vec3 up = vec3(0,1,0);
    vec3 right = cross(cam_dir, up);                   
    vec3 cam_up = cross(right, cam_dir);
  
    vec3 pos = cam_pos;
    vec3 vel = cam_dir;
    vel = vel + cam_up * coord.y * fovV;
    vel = vel + right * coord.x * fovH;
    vel = normalize(vel) * c;

    vec3 vel_front = normalize(cam_dir);
    float vel_angle = angleBetween( vel_front, vel);  
    vel_front *= c * cos(vel_angle);
    vec3 vel_up = vel - vel_front;   
    vel_front = normalize(vel_front) * c;
    vel_up = normalize(vel_up) * c;

    float angle;
    float r;
    float fg;
    float delta_a;

    vec3 force;

    for(float t = 0.0; t < 20.0; t+=dt){
      force = -pos;
      angle = angleBetween( vel_front, force);
      r = length( force);
  
      fg = G * m / (r*r);
      delta_a = -fg * dt / c * sin(vel_angle - angle); 
      delta_a /= abs(1.0 - 2.0 * G * m / (r*c*c));

      vel_angle -= delta_a; 

      vel = cos( vel_angle) * vel_front + sin( vel_angle) * vel_up;
      
      if(pos.y < 1.0 && pos.y > -1.0){
        if( r < 6.0*rs  && r > 3.0*rs){
          gl_FragColor = vec4(0.7, cos(r/3.0)/10.0 + 0.4, 0.0, 1.0);
          return;
        }
      } 

      if(r <= rs * 1.03) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      pos += vel*dt;
    }
    gl_FragColor = vec4(0.1,0.1,0.1, 1.0);
  }`;
