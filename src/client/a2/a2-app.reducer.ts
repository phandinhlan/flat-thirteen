import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { storeLogger } from 'ngrx-store-logger';
import { routerReducer, RouterState } from '@ngrx/router-store';

import { LessonState } from '../../app/lesson/lesson.reducer';
import { PlayerState } from '../../app/player/player.reducer';
import { StageState } from '../../app/stage/stage.reducer';

export interface A2AppState {
  lesson: LessonState;
  stage: StageState;
  player: PlayerState;
  router: RouterState;
}

export const reducers = {
  lesson: LessonState.reducer,
  stage: StageState.reducer,
  player: PlayerState.reducer,
  router: routerReducer,
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

const DEV_REDUCERS = [stateSetter, storeFreeze];
// set in constants.js file of project root
if (['logger', 'both'].indexOf(STORE_DEV_TOOLS) !== -1 ) {
    DEV_REDUCERS.push(storeLogger());
}

const developmentReducer = compose(...DEV_REDUCERS, combineReducers)(reducers);
const productionReducer = compose(combineReducers)(reducers);

export function rootReducer(state: any, action: any) {
  if (ENV !== 'development') {
    return productionReducer(state, action);
  } else {
    return developmentReducer(state, action);
  }
}
