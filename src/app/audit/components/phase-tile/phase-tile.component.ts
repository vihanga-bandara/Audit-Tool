import { Component, OnInit, Input } from '@angular/core';
import { Phase } from 'src/app/shared/models/phase';
import { Product } from 'src/app/shared/models/product';

@Component({
  selector: 'app-phase-tile',
  templateUrl: './phase-tile.component.html',
  styleUrls: ['./phase-tile.component.scss']
})
export class PhaseTileComponent implements OnInit {

  @Input() phase: Phase;
  @Input() productId: number;

  constructor() { }

  ngOnInit() {
  }

}
