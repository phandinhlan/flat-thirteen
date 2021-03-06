import { Component, Input } from '@angular/core';

import { PlayerService } from '../../../../common/player/player.service';
import { TransportService } from '../../../../common/core/transport.service';

/**
 * The BeatComponent is used by html-grid to represent a single note box
 * in the grid.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.pug',
  styleUrls: ['beat.component.styl'],
})
export class BeatComponent {
  @Input() private pulses: number[];
  @Input() private beat: number;
  @Input() private key: string;

  constructor(private transport: TransportService, private player: PlayerService) {}

  noteClass() {
    return noteTypes[this.pulses.length];
  }

  controlNoteClass(pulse: number) {
    return this.noteClass() + (this.player.value(this.key, pulse) ? ' on' : '');
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};
