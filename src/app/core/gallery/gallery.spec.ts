import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PhotoService } from '../photo.service';
import { Router } from '@angular/router';

import { Gallery } from './gallery';
import { IPhoto } from '../photo';
import { Item } from '../../photos/item/item';

const routerMock = {
  navigateByUrl: vi.fn(),
};

const photoServiceMock = {
  setSelectedPhoto: vi.fn(),
  updatePhoto: vi.fn(),
};

const mockPhotos: IPhoto[] = [
  { id: 1, url: 'a.jpg', favorite: false } as IPhoto,
  { id: 2, url: 'b.jpg', favorite: true } as IPhoto,
];

describe('Gallery', () => {
  let component: Gallery;
  let fixture: ComponentFixture<Gallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, MatIconModule, Gallery, Item],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: PhotoService, useValue: photoServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Gallery);
    component = fixture.componentInstance;

    component.photos = signal(mockPhotos);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render gallery items', () => {
    const items = fixture.debugElement.queryAll(By.css('.gallery-item'));
    expect(items.length).toBe(2);
  });

  it('should navigate to photo detail', () => {
    const photo = mockPhotos[0];

    component.onNavigateToDetail(photo);

    expect(photoServiceMock.setSelectedPhoto).toHaveBeenCalledWith(photo);
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/photos/1');
  });

  it('should add photo to favorites', () => {
    const photo = mockPhotos[0];

    component.onAddFavorite(photo);

    expect(photoServiceMock.updatePhoto).toHaveBeenCalledWith({
      ...photo,
      favorite: true,
    });
  });

  it('should hide favorite button when isFavorite is true', () => {
    fixture.componentRef.setInput('isFavorite', true);
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('.favorite-btn'));
    expect(button).toBeNull;
  });

  it('should show favorite button when isFavorite is false', () => {
    fixture.componentRef.setInput('isFavorite', false);
    fixture.detectChanges();

    const buttons = fixture.debugElement.queryAll(By.css('.favorite-btn'));
    expect(buttons.length).toBe(2);
  });

  it('should trigger favorite on button click', () => {
    const button = fixture.debugElement.query(By.css('.favorite-btn'));

    button.triggerEventHandler('click');
    expect(photoServiceMock.updatePhoto).toHaveBeenCalled();
  });
});
