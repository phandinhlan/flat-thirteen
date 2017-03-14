import * as _ from 'lodash';
import { Directive, Component, Input, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ElementRef } from '@angular/core';

import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from '../grid.model';
import { PlayerService } from '../../../../common/player/player.service';
import { StageService } from '../../../../common/stage/stage.service';
import { TransportService } from '../../../../common/core/transport.service';

import { TopEffect } from '../top-effect';

/*
@Directive({selector: 'top-effect'})
class TopEffectDirective {
  constructor(private viewContainer: ViewContainerRef, private elementRef: ElementRef){

  }

  getElement() {
    return this.elementRef.nativeElement;
  }
}
*/

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.pug',
  styleUrls: ['html-grid.component.styl'],
})
export class HtmlGridComponent implements OnInit, AfterViewInit {
  @Input() private grid: Grid;
  private gridClass$: Observable<string>;
  private topEffect: TopEffect;
  //@ViewChild(TopEffectDirective) topEffectElement: TopEffectDirective;

  constructor(private transport: TransportService, private player: PlayerService,
              private stage: StageService) {
    this.gridClass$ = combineLatest(stage.scene$, player.selected$).map(
        ([scene, selected]) => scene.toLowerCase() + (this.grid.listens(selected) ? ' selected' : ''));

    this.topEffect = new TopEffect();
  }

  ngOnInit() {
    if (!this.grid) {
      throw new Error('Missing grid');
    }
  }

  ngAfterViewInit() {   
    //let width = this.topEffectElement.clientWidth;
    //let height = this.topEffectElement.clientHeight;
    //let width = this.topEffectElement.getElement().clientWidth;
    //console.log(width);
    /*
    console.log(height);
    */
    let element = document.getElementById('top-effect');
    let width = element.clientWidth;
    let height = element.clientHeight;
    this.topEffect.init(width, height);
    element.appendChild(this.topEffect.getView());

    this.render();
  }

  pulsesFor(beat: number) {
    let offset = _.sum(this.grid.pulsesByBeat.slice(0, beat));
    return _.times(this.grid.pulsesByBeat[beat], (i) => offset + i);
  }

  render() {
    this.topEffect.render();

    requestAnimationFrame(this.render.bind(this));
  }

  adjustTopEffectCanvasSize(event) {
    let element = document.getElementById('top-effect');
    let width = element.clientWidth;
    let height = element.clientHeight;
    this.topEffect.resize(width, height, false);
  }
}
