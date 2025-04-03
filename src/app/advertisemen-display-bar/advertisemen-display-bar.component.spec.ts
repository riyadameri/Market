import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisemenDisplayBarComponent } from './advertisemen-display-bar.component';

describe('AdvertisemenDisplayBarComponent', () => {
  let component: AdvertisemenDisplayBarComponent;
  let fixture: ComponentFixture<AdvertisemenDisplayBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisemenDisplayBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisemenDisplayBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
