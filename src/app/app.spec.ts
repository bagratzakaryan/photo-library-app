import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';

import { App } from './app';
import { Photos } from './photos/photos';
import { Favorites } from './favorites/favorites';

describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        App,
        MatButtonModule,
        RouterModule.forRoot([
          { path: '', component: Photos },
          { path: 'favorites', component: Favorites },
        ]),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;

    await router.initialNavigation();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links.length).toBe(2);
    expect(links[0].nativeElement.textContent.trim()).toBe('Photos');
    expect(links[1].nativeElement.textContent.trim()).toBe('Favorites');
  });

  it('should have correct routerLink values', () => {
    const links = fixture.debugElement.queryAll(By.css('a'));
    expect(links[0].attributes['routerLink']).toEqual('/');
    expect(links[1].attributes['routerLink']).toEqual('/favorites');
  });

  it('should apply "active" class on the "/" route', async () => {
    const links = fixture.debugElement.queryAll(By.css('a'));

    await router.navigate(['/']);
    fixture.detectChanges();

    expect(links[0].nativeElement.classList.contains('active')).toBe(true);
    expect(links[1].nativeElement.classList.contains('active')).toBe(false);
  });

  it('should apply "active" class on the "/favorites" route', async () => {
    const links = fixture.debugElement.queryAll(By.css('a'));

    await router.navigate(['/favorites']);
    fixture.detectChanges();

    expect(links[1].nativeElement.classList).toContain('active');
    expect(links[0].nativeElement.classList).not.toContain('active');
  });
});
