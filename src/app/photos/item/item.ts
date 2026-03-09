import { Component, Input } from '@angular/core';
import { IPhoto } from '../../core/photo';

@Component({
  selector: 'xm-item',
  imports: [],
  templateUrl: './item.html',
  styleUrl: './item.scss',
})
export class Item {
  @Input() photo = {} as IPhoto;
}
