import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvertisementDisplayBarComponentComponent } from './advertisement-display-bar-component.component';

describe('AdvertisementDisplayBarComponentComponent', () => {
  let component: AdvertisementDisplayBarComponentComponent;
  let fixture: ComponentFixture<AdvertisementDisplayBarComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvertisementDisplayBarComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvertisementDisplayBarComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
