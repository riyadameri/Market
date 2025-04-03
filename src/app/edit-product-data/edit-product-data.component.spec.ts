import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProductDataComponent } from './edit-product-data.component';

describe('EditProductDataComponent', () => {
  let component: EditProductDataComponent;
  let fixture: ComponentFixture<EditProductDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditProductDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditProductDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
