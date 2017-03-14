import * as PIXI from 'pixi.js'

export class TopEffect {
  renderer: PIXI.SystemRenderer;
  container: PIXI.Container;

  init(width: number, height: number) {
    this.renderer = PIXI.autoDetectRenderer(width, height, { transparent: false });
    this.renderer.autoResize = true;
    this.container = new PIXI.Container();
  }

  getView() {
    return this.renderer.view;
  }

  render() {
    this.renderer.render(this.container);
  }

  resize(width: number, height: number, scale: boolean) {
    this.renderer.resize(width, height);
    if (true === scale) {
      //TODO: scale
    }
  }
}