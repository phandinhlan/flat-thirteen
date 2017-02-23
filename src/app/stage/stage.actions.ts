import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { StageUxMode } from './stage.reducer';

@Injectable()
export class StageActions {

  constructor() {}

  static INIT = '[STAGE] Init';
  init(): Action {
    return {
      type: StageActions.INIT
    };
  }

  static RESET = '[STAGE] Reset';
  reset(): Action {
    return {
      type: StageActions.RESET
    };
  }

  static NEXTROUND = '[STAGE] NextRound';
  nextRound(mode: StageUxMode, playedGoal: boolean): Action {
    return {
      type: StageActions.NEXTROUND,
      payload: [mode, playedGoal]
    };
  }
}