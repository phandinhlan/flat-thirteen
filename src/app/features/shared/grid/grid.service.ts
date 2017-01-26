import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as Tone from 'tone';

import { Instrument } from '../instruments/instrument';

const livePlayWithin: number = 0.3;

enum State {
  Count,
  Demo,
  Play,
  Victory
}

@Injectable()
export class GridService {
  gridLoop: Tone.Loop;
  noteLoop: Tone.Loop;

  paused: boolean = true;
  state: State;
  nextState: State = State.Count;
  round: number = 0;
  beat: number = 0;
  active: boolean = false;
  inactiveRounds: number = 0;

  numStrips: number;
  numBeats: number;
  sounds: Instrument[];
  gridValues: number[][];
  goalValues: number[][];
  playedValues: number[][];
  numGoalNotes: number;

  initializeIfNeeded() {
    if (!this.gridLoop) {
      this.gridLoop = new Tone.Loop((time) => { this.onTop() }, '1m');
      this.gridLoop.start(0);

      this.noteLoop = new Tone.Loop((time) => { this.onBeat() }, '4n');
      this.noteLoop.start(0);
    }
  }

  resetStage(sounds?: Instrument[], numBeats?: number) {
    this.initializeIfNeeded();
    this.sounds = sounds || this.sounds;
    this.numStrips = this.sounds.length;
    this.numBeats = numBeats || this.numBeats;
    this.gridValues = _.times(this.numStrips, () => _.fill(Array(this.numBeats), 0));
    this.clearPlayed();
    this.newGoal(4);
  }

  clearPlayed() {
    this.playedValues = _.times(this.numStrips, () => []); // TODO: Replace with _.stubArray when @types/lodash updated
  }

  newGoal(maxNotes: number) {
    this.numGoalNotes = 0;
    this.goalValues = _.times(this.numStrips, () => {
      let strip: number[] = [];
      for (let j = 0; j < this.numBeats; j++) {
        let value = this.numGoalNotes < maxNotes ? _.random(1) : 0;
        strip.push(value);
        if (value) {
          this.numGoalNotes++;
        }
      }
      return strip;
    });
  }

  start() {
    this.paused = false;
    Tone.Transport.start();
  }

  stop(shouldDestroy) {
    this.paused = true;
    Tone.Transport.stop(0);
    if (shouldDestroy) {
      this.gridLoop.dispose();
      this.noteLoop.dispose();
    }
  }

  onTop() {
    if (_.isEqual(this.playedValues, this.goalValues)) {
      this.resetStage();
      this.nextState = State.Victory;
    } else {
      this.clearPlayed();
      if (this.active) {
        this.inactiveRounds = 0;
      } else if (this.inactiveRounds >= 3) {
        this.nextState = State.Demo;
      }
    }

    this.state = this.nextState;
    this.active = false;
    this.beat = 0;
    switch(this.state) {
      case State.Count:
      case State.Victory:
        this.nextState = State.Demo;
        this.round = 0;

        break;
      case State.Demo:
        this.nextState = State.Play;
        this.inactiveRounds = 0;
        break;
      case State.Play:
        this.round++;
        if (!this.active) {
          this.inactiveRounds++;
        } else {
          this.inactiveRounds = 0;
        }
    }
  }

  onBeat() {
    if (this.state === State.Demo) {
      this.playGoal(this.beat);
    } else {
      this.playBeat(this.beat);
    }
    this.beat++;
  }

  playGoal(beatIndex: number) {
    _.times(this.numStrips, (i) => {
      if (this.goalValues[i][beatIndex]) {
        this.sounds[i].play();
      }
    });
  }

  playBeat(beatIndex: number) {
    _.times(this.numStrips, (i) => {
      if (this.gridValues[i][beatIndex]) {
        this.sounds[i].play();
        this.playedValues[i].push(1);
      } else {
        this.playedValues[i].push(0);
      }
    });
  }

  onToggle(stripIndex: number, beatIndex: number) {
    if (this.state === State.Count || this.state === State.Victory) {
      return;
    }
    this.active = true;
    this.gridValues[stripIndex][beatIndex] =
      this.gridValues[stripIndex][beatIndex] ? 0 : 1;
    if (this.gridValues[stripIndex][beatIndex] && this.canPlaySound(beatIndex, this.noteLoop.progress)) {
      this.sounds[stripIndex].play();
      this.playedValues[stripIndex][beatIndex] = 1;
    }
  }

  canPlaySound(beatIndex: number, delay: number) {
    if (beatIndex !== this.beat - 1) {
      return false;
    }
    return delay < livePlayWithin;
  }

  public stateName() {
    return State[this.state];
  }

  public getStateName() {
    let name = '';
    switch(this.state) {
      case State.Count:
        name = 'count';
        break;
      case State.Victory:
        name = 'victory';
        break;
      case State.Demo:
        name = 'demo';
        break;
      case State.Play:
        name = 'play';
        break;
    }

    return name;
  }

  showOverlay() {
    return this.paused || this.state === State.Count || this.state === State.Victory;
  }

  showPosition() {
    return this.state === State.Demo || this.state === State.Play;
  }

  getBeatCount() {
    return this.numBeats;
  }

  getStripCount() {
    return this.numStrips;
  }
}
