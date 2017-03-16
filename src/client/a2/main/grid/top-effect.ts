import * as PIXI from 'pixi.js'

class ExampleFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      uniform float time;

      void main()
      {
          //gl_FragColor = vec4(gl_FragCoord.x/1000.0, 0.0, 0.0, 1.0);
          gl_FragColor = vec4(time, 0.0, 0.0, 1.0);
      }
      `, 
      {
        time: { type: '1f' }
      }
    );
  }
}

class ShockwaveFilter extends PIXI.Filter {
  constructor() {
    super(
      null, 
      `
      varying vec2 vTextureCoord;

      uniform sampler2D uSampler;

      uniform vec2 center;
      uniform vec3 params; // 10.0, 0.8, 0.1
      uniform float time;

      void main()
      {
          vec2 uv = vTextureCoord;
          vec2 texCoord = uv;

          float dist = distance(uv, center);

          if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )
          {
              float diff = (dist - time);
              float powDiff = 1.0 - pow(abs(diff*params.x), params.y);

              float diffTime = diff  * powDiff;
              vec2 diffUV = normalize(uv - center);
              texCoord = uv + (diffUV * diffTime);
          }

          gl_FragColor = texture2D(uSampler, texCoord);
      }
      `, 
      {
        uSampler: { type: 'sampler2D', value: 0 },
        center: { type: 'vec2' },
        params: { type: 'vec3' },
        time: { type: '1f', value: 0 }
      }
    );
  }
}


export class TopEffect {
  renderer: PIXI.SystemRenderer;
  container: PIXI.Container;
  width: number;
  height: number;
  shockwaveFilter: ShockwaveFilter;

  init(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.renderer = PIXI.autoDetectRenderer(width, height, { transparent: false });
    this.renderer.autoResize = true;
    this.container = new PIXI.Container();

    let g = new PIXI.Graphics();
    g.beginFill(0xaa3333);
    g.drawRect(0, 0, 500, 500);
    g.endFill();
    let texture = g.generateCanvasTexture();
    let sprite = new PIXI.Sprite(texture);

    this.shockwaveFilter = new ShockwaveFilter();
    this.shockwaveFilter.uniforms['center'] = [0.5, 0.5];
    this.shockwaveFilter.uniforms['params'] = [10, 0.8, 0.1];
    this.shockwaveFilter.uniforms['time'] = 0;
    /*
    this.shockwaveFilter = new ExampleFilter();
    this.shockwaveFilter.uniforms.time = 0.0;
    */

    //g.filters = [this.shockwaveFilter];
    sprite.filters = [this.shockwaveFilter];

    this.container.addChild(sprite);
  }

  getView() {
    return this.renderer.view;
  }

  render() {
    this.shockwaveFilter.uniforms.time += 0.01;
    if (this.shockwaveFilter.uniforms.time >= 1.0) {
        this.shockwaveFilter.uniforms.time = 0.0;
    }
    this.renderer.render(this.container);

    
  }

  resize(width: number, height: number, scale: boolean) {
    this.renderer.resize(width, height);
    if (true === scale) {
      //TODO: scale
    }
  }
}