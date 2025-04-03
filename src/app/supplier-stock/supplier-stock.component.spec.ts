import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierStockComponent } from './supplier-stock.component';

describe('SupplierStockComponent', () => {
  let component: SupplierStockComponent;
  let fixture: ComponentFixture<SupplierStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplierStockComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupplierStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
