import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierProdInfoComponent } from './supplier-prod-info.component';

describe('SupplierProdInfoComponent', () => {
  let component: SupplierProdInfoComponent;
  let fixture: ComponentFixture<SupplierProdInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierProdInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierProdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
