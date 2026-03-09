import { Injectable, Signal, signal, computed } from '@angular/core';
import { of, delay, tap, Observable } from 'rxjs';

import { IPhoto } from './photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private photoCounter = 1;

  private readonly photosSignal = signal<IPhoto[]>(this.loadPhotos(9));
  private readonly selectedPhotoSignal = signal<IPhoto>({} as IPhoto);

  readonly photos = this.photosSignal.asReadonly();
  readonly selectedPhoto = this.selectedPhotoSignal.asReadonly();

  updatePhotos(photos: IPhoto[]): void {
    this.photosSignal.update((currentPhotos: IPhoto[]) => [...currentPhotos, ...photos]);
  }

  updatePhoto(photo: IPhoto): void {
    this.photosSignal.update((photos: IPhoto[]) => {
      return photos.map((item) => {
        if (item.id === photo.id) {
          return photo;
        }

        return item;
      });
    });
  }

  setSelectedPhoto(photo: IPhoto): void {
    this.selectedPhotoSignal.set(photo);
  }

  updateSelectedPhoto(photo: IPhoto): void {
    this.setSelectedPhoto(photo);
    this.updatePhoto(photo);
  }

  favoritePhotos(): Signal<IPhoto[]> {
    const favorites = computed(() => this.photos().filter((photo: IPhoto) => photo.favorite));

    if (favorites().length) {
      sessionStorage.setItem('favorites', JSON.stringify(favorites()));
      return favorites;
    }

    // since the browser runs the image url which was given, finial url
    // applied in browser when image loaded, that is why every time when
    // you reload the browser it generates different images, and user see
    // it different, but the applied urls of images in code the same every time
    const favoritesFromStorage = sessionStorage.getItem('favorites');
    if (favoritesFromStorage) {
      return signal(JSON.parse(favoritesFromStorage));
    }

    return signal([]);
  }

  loadPhotos$(amount = 6): Observable<IPhoto[]> {
    return of(this.loadPhotos(amount)).pipe(
      delay(300),
      tap((photos: IPhoto[]) => this.updatePhotos(photos)),
    );
  }

  private loadPhotos(amount: number): IPhoto[] {
    return Array.from({ length: amount }, () => {
      const id = this.photoCounter++;
      return {
        id,
        url: `https://picsum.photos/200/300?random=${id}`,
        description: `gallery item ${id}`,
        favorite: false,
      };
    });
  }
}
