import { Component, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { IPhoto } from '../../core/photo';
import { Item } from '../item/item';
import { PhotoService } from '../../core/photo.service';

@Component({
  selector: 'xm-details',
  imports: [MatButtonModule, Item],
  templateUrl: './details.html',
  styleUrl: './details.scss',
})
export class Details {
  selectedPhoto!: Signal<IPhoto>;

  constructor(private readonly photoService: PhotoService) {
    this.selectedPhoto = this.photoService.selectedPhoto;
  }

  onRemoveFavorite(): void {
    this.photoService.updateSelectedPhoto({
      ...this.selectedPhoto(),
      favorite: false,
    });
  }
}
