import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { createSelector } from 'reselect';
import 'rxjs/add/operator/distinctUntilChanged';

import { AppState } from "../reducers/index";
import { Observable } from "rxjs";
import { PlayerActions } from "./player.actions";
import { Surface } from "../features/shared/surface.model";

@Injectable()
export class PlayerService {
  static getPlayer = (state: AppState) => state.player;
  static getData = createSelector(PlayerService.getPlayer, player => player && player.data);
  static getSelected = createSelector(PlayerService.getPlayer, player => player && player.selected);
  static getBeat = createSelector(PlayerService.getPlayer, player => player && player.beat);
  static getCursor = createSelector(PlayerService.getPlayer, player => player && player.cursor);

  private data$: Observable<_.Dictionary<Surface.Data>>;
  private selected$: Observable<string>;
  private beat$: Observable<number>;
  private cursor$: Observable<number>;

  private _data: _.Dictionary<Surface.Data>;
  private _selected: string;
  private _beat: number;
  private _cursor: number;

  constructor(private store: Store<AppState>, private player: PlayerActions) {
    this.data$ = this.store.select(PlayerService.getData);
    this.selected$ = this.store.select(PlayerService.getSelected);
    this.beat$ = this.store.select(PlayerService.getBeat);
    this.cursor$ = this.store.select(PlayerService.getCursor);

    this.data$.subscribe(data => { this._data = data });
    this.selected$.subscribe(selected => { this._selected = selected });
    this.beat$.subscribe(beat => { this._beat = beat });
    this.cursor$.subscribe(cursor => { this._cursor = cursor });
  }

  get data() {
    return this._data;
  }

  get selected() {
    return this._selected;
  }

  get beat() {
    return this._beat;
  }

  get cursor() {
    return this._cursor;
  }

  init(surfaces: Surface[]) {
    this.store.dispatch(this.player.init(surfaces));
  }

  select(key: string) {
    this.store.dispatch(this.player.select(key));
  }

  unselect(key: string) {
    this.store.dispatch(this.player.unselect(key));
  }

  set(key: string) {
    this.store.dispatch(this.player.set(key));
  }

  unset(key: string) {
    this.store.dispatch(this.player.unset(key));
  }

  pulses(key: string, pulses: number) {
    this.store.dispatch(this.player.pulses(key, pulses));
  }

  getValue(key: string, cursor: number = 0): number {
    return this.data[key].value[cursor];
  }

  toggle(key: string) {
    if (this.getValue(key)) {
      this.unset(key);
    } else {
      this.set(key);
    }
  }
}