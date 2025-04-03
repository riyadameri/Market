import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class AddProductComponent {
  @Output() productSubmit = new EventEmitter<FormData>();
  
  productForm: FormGroup;
  categories = ['Outerwear', 'Apparel', 'Electronics', 'Footwear', 'Accessories'];
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  rentalPeriodOptions = ['3 days', '1 week', '2 weeks', '1 month'];
  imagePreview: string | ArrayBuffer | null = null;
  brandLogoPreview: string | ArrayBuffer | null = null;

  showPaymentModal: boolean = false;
  orderNumber: string = '';


  openPaymentModal() {
    this.showPaymentModal = true;
    this.generateOrderNumber();
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }


  generateOrderNumber(): string {
    if (!this.orderNumber) {
      const date = new Date();
      const prefix = 'ORD';
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      this.orderNumber = `${prefix}-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${randomNum}`;
    }
    return this.orderNumber;
  }
  
  printPaymentInstructions() {
    window.print();
  }

  confirmPayment() {
    this.closePaymentModal();
    // You can add additional confirmation logic here
    alert(`Order ${this.orderNumber} has been confirmed. Please proceed with payment to the supplier.`);
  }

  constructor(private fb: FormBuilder) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: ['', [Validators.min(0)]],
      rentalPrice: ['', [Validators.min(0)]],
      imageFile: [null, Validators.required],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      discount: ['', [Validators.min(0), Validators.max(100)]],
      isFeatured: [false],
      isAvailable: [true],
      brand: this.fb.group({
        name: ['', Validators.required],
        logoFile: [null]
      }),
      rating: ['', [Validators.min(0), Validators.max(5)]],
      reviewCount: ['', [Validators.min(0)]],
      colors: this.fb.array([this.fb.control('')]),
      sizes: this.fb.array([this.fb.control('')]),
      rentalPeriods: this.fb.array([this.fb.control('')])
    });
  }

  get colors(): FormArray {
    return this.productForm.get('colors') as FormArray;
  }

  get sizes(): FormArray {
    return this.productForm.get('sizes') as FormArray;
  }

  get rentalPeriods(): FormArray {
    return this.productForm.get('rentalPeriods') as FormArray;
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.productForm.patchValue({ imageFile: file });
      this.productForm.get('imageFile')?.updateValueAndValidity();
      
      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onBrandLogoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      this.productForm.get('brand')?.patchValue({ logoFile: file });
      this.productForm.get('brand.logoFile')?.updateValueAndValidity();
      
      // Preview logo
      const reader = new FileReader();
      reader.onload = () => {
        this.brandLogoPreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.productForm.patchValue({ imageFile: null });
    this.imagePreview = null;
  }

  removeBrandLogo() {
    this.productForm.get('brand')?.patchValue({ logoFile: null });
    this.brandLogoPreview = null;
  }

  addColor(color: string = '') {
    this.colors.push(this.fb.control(color));
  }

  removeColor(index: number) {
    if (this.colors.length > 1) {
      this.colors.removeAt(index);
    }
  }

  addSize(size: string = '') {
    this.sizes.push(this.fb.control(size));
  }

  removeSize(index: number) {
    if (this.sizes.length > 1) {
      this.sizes.removeAt(index);
    }
  }

  addRentalPeriod(period: string = '') {
    this.rentalPeriods.push(this.fb.control(period));
  }

  removeRentalPeriod(index: number) {
    if (this.rentalPeriods.length > 1) {
      this.rentalPeriods.removeAt(index);
    }
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      
      // Append all form values to FormData
      Object.keys(this.productForm.value).forEach(key => {
        if (key === 'brand') {
          Object.keys(this.productForm.value.brand).forEach(brandKey => {
            if (brandKey === 'logoFile' && this.productForm.value.brand.logoFile) {
              formData.append('brandLogo', this.productForm.value.brand.logoFile);
            } else {
              formData.append(`brand[${brandKey}]`, this.productForm.value.brand[brandKey]);
            }
          });
        } else if (key === 'colors' || key === 'sizes' || key === 'rentalPeriods') {
          this.productForm.value[key].forEach((item: string, index: number) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else if (key === 'imageFile') {
          formData.append('image', this.productForm.value.imageFile);
        } else {
          formData.append(key, this.productForm.value[key]);
        }
      });

      this.productSubmit.emit(formData);
    }
  }
}