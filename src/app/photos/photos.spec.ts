import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, ChangeDetectorRef } from '@angular/core';

import { of, Subject } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

import { Photos } from './photos';
import { PhotoService } from '../core/photo.service';
import { IPhoto } from '../core/photo';

const photosSignal = signal<IPhoto[]>([]);

const photoServiceMock = {
  photos: photosSignal,
  loadPhotos$: vi.fn().mockReturnValue(of([])),
};

const cdMock = {
  detectChanges: vi.fn(),
};

describe('Photos', () => {
  let component: Photos;
  let fixture: ComponentFixture<Photos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Photos],
      providers: [
        { provide: PhotoService, useValue: photoServiceMock },
        { provide: ChangeDetectorRef, useValue: cdMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Photos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should use photos signal from service', () => {
    expect(component.photos).toBe(photosSignal);
  });

  it('should call loadPhotos when near bottom', () => {
    const spy = vi.spyOn(component as any, 'loadPhotos');

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(900);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(200);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(1000);

    component.onWindowScroll();

    expect(spy).toHaveBeenCalled();
  });

  it('should not call loadPhotos if not near bottom', () => {
    const spy = vi.spyOn(component as any, 'loadPhotos');

    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(100);
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(200);
    vi.spyOn(document.documentElement, 'scrollHeight', 'get').mockReturnValue(2000);

    component.onWindowScroll();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call service and toggle loading', () => {
    const detectSpy = vi.spyOn((component as any).cd, 'detectChanges');

    photoServiceMock.loadPhotos$.mockReturnValue(of([]));

    (component as any).loadPhotos();

    expect(photoServiceMock.loadPhotos$).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(detectSpy).toHaveBeenCalled();
  });

  it('should prevent loading if already loading', () => {
    component.loading = true;

    (component as any).loadPhotos();

    expect(photoServiceMock.loadPhotos$).not.toHaveBeenCalled();
  });

  it('should set loading true until observable completes', () => {
    const subject = new Subject<void>();
    const detectSpy = vi.spyOn((component as any).cd, 'detectChanges');

    photoServiceMock.loadPhotos$.mockReturnValue(subject.asObservable());

    (component as any).loadPhotos();

    expect(component.loading).toBe(true);

    subject.next();
    subject.complete();

    expect(component.loading).toBe(false);
    expect(detectSpy).toHaveBeenCalled();
  });
});
