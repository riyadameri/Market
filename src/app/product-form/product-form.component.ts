import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { ProductService } from '../services/product.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, HeaderComponent, HttpClientModule],
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

  constructor(
    private fb: FormBuilder,
    private productService: ProductService
  ) {
    this.productForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      price: ['', [Validators.required, Validators.min(0)]],
      originalPrice: ['', [Validators.required, Validators.min(0)]],
      rentalPrice: ['', [Validators.required, Validators.min(0)]],
      imageFile: [null, Validators.required],
      category: ['', Validators.required],
      stock: ['', [Validators.required, Validators.min(0)]],
      regions: [''], // Added regions field
      brand: this.fb.group({
        name: ['', Validators.required],
        logoFile: [null, Validators.required] // Made brand logo required
      }),
      colors: this.fb.array([this.fb.control('', Validators.required)]),
      sizes: this.fb.array([this.fb.control('', Validators.required)]),
      rentalPeriods: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }
  userData: any = JSON.parse(localStorage.getItem('user') || '{}');

  userId = this.userData._id ;
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
    this.colors.push(this.fb.control(color, Validators.required));
  }

  removeColor(index: number) {
    if (this.colors.length > 1) {
      this.colors.removeAt(index);
    }
  }

  addSize(size: string = '') {
    this.sizes.push(this.fb.control(size, Validators.required));
  }

  removeSize(index: number) {
    if (this.sizes.length > 1) {
      this.sizes.removeAt(index);
    }
  }

  addRentalPeriod(period: string = '') {
    this.rentalPeriods.push(this.fb.control(period, Validators.required));
  }

  removeRentalPeriod(index: number) {
    if (this.rentalPeriods.length > 1) {
      this.rentalPeriods.removeAt(index);
    }
  }

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
    alert(`Order ${this.orderNumber} has been confirmed. Please proceed with payment to the supplier.`);
  }

  onSubmit() {
    if (this.productForm.valid) {
      const formData = new FormData();
      
      // Append all form values to FormData
      formData.append('userId', this.userId);
      formData.append('name', this.productForm.get('name')?.value);
      formData.append('description', this.productForm.get('description')?.value);
      formData.append('price', this.productForm.get('price')?.value);
      formData.append('originalPrice', this.productForm.get('originalPrice')?.value);
      formData.append('rentalPrice', this.productForm.get('rentalPrice')?.value);
      formData.append('category', this.productForm.get('category')?.value);
      formData.append('stock', this.productForm.get('stock')?.value);
      formData.append('regions', this.productForm.get('regions')?.value || '');
  
      // Append image file
      const imageFile = this.productForm.get('imageFile')?.value;
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
      }
  
      // Append brand info
      formData.append('brand[name]', this.productForm.get('brand.name')?.value);
      const brandLogoFile = this.productForm.get('brand.logoFile')?.value;
      if (brandLogoFile) {
        formData.append('brandLogo', brandLogoFile, brandLogoFile.name);
      }
  
      // Append arrays
      this.colors.controls.forEach((control, index) => {
        formData.append(`colors[${index}]`, control.value);
      });
  
      this.sizes.controls.forEach((control, index) => {
        formData.append(`sizes[${index}]`, control.value);
      });
  
      this.rentalPeriods.controls.forEach((control, index) => {
        formData.append(`rentalPeriods[${index}]`, control.value);
      });
  
      // Log FormData contents for debugging
      formData.forEach((value, key) => {
        console.log(key, value);
      });
  
      this.productService.addProduct(formData).subscribe({
        next: (response) => {
          console.log('Product added successfully', response);
          this.productForm.reset();
          this.imagePreview = null;
          this.brandLogoPreview = null;
          this.openPaymentModal();
        },
        error: (error) => {
          console.error('Error adding product', error);
          alert('Error adding product. Please try again.');
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }
}