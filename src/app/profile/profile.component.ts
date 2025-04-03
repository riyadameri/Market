import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../header/header.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, CommonModule, HeaderComponent, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab: string = 'personal';
  profileForm: FormGroup;
  registerForm: FormGroup;
  verificationForm: FormGroup;
  showVerification = false;
  verificationCode = ['', '', '', '', '', ''];

  // Sample data
  profile = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'June 2023',
    phone: '+1 (555) 123-4567',
    address: '123 Fashion Street, Apt 4B\nNew York, NY 10001'
  };

  orders = [
    {
      id: 'FDZ-2023-4567',
      date: 'June 15, 2023',
      status: 'delivered',
      statusText: 'Delivered',
      items: [
        {
          name: 'Premium Denim Jacket',
          price: 89.99,
          quantity: 1,
          image: 'https://i.pinimg.com/736x/4d/65/8f/4d658fd2ad28e52e55786982a8768b6e.jpg'
        }
      ],
      total: 94.99
    },
    {
      id: 'FDZ-2023-3210',
      date: 'May 28, 2023',
      status: 'shipped',
      statusText: 'Shipped',
      items: [
        {
          name: 'Casual Summer Dress',
          price: 49.99,
          quantity: 1,
          image: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg'
        },
        {
          name: 'Floral Scarf',
          price: 19.99,
          quantity: 2,
          image: 'https://i.pinimg.com/736x/a6/4c/34/a64c340ba67c5f55daa493cb0484c5a1.jpg'
        }
      ],
      total: 89.97
    }
  ];

  wishlist = [
    {
      name: 'Leather Crossbody Bag',
      price: 129.99,
      image: 'https://i.pinimg.com/736x/92/27/6b/92276bdd670feaa61dd16c010fbe7be5.jpg'
    },
    {
      name: 'Suede Ankle Boots',
      price: 149.99,
      image: 'https://i.pinimg.com/736x/c6/c6/38/c6c63802737acc97b2f0f19566b3fdf2.jpg'
    },
    {
      name: 'Oversized Sunglasses',
      price: 39.99,
      image: 'https://i.pinimg.com/736x/4d/65/8f/4d658fd2ad28e52e55786982a8768b6e.jpg'
    }
  ];

  settings = {
    notifications: 'all',
    theme: 'light',
    newsletter: true,
    promotions: true
  };

  constructor(private fb: FormBuilder) {
    // Profile Form
    this.profileForm = this.fb.group({
      user_type: ['customer', Validators.required],
      full_name: [this.profile.name, Validators.required],
      email: [this.profile.email, [Validators.required, Validators.email]],
      phone: [this.profile.phone, Validators.required],
      address: [this.profile.address, Validators.required]
    });

    // Registration Form
    this.registerForm = this.fb.group({
      user_type: ['customer', Validators.required],
      full_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirm_password: ['', [Validators.required, Validators.minLength(8)]],
      agree_terms: [false, Validators.requiredTrue]
    }, { validator: this.checkPasswords });

    // Verification Form
    this.verificationForm = this.fb.group({
      code0: ['', Validators.required],
      code1: ['', Validators.required],
      code2: ['', Validators.required],
      code3: ['', Validators.required],
      code4: ['', Validators.required],
      code5: ['', Validators.required]
    });
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirm_password')?.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  onSubmit() {
    if (this.profileForm.valid) {
      console.log('Form submitted:', this.profileForm.value);
      this.profile.name = this.profileForm.value.full_name;
      this.profile.email = this.profileForm.value.email;
      this.profile.phone = this.profileForm.value.phone;
      this.profile.address = this.profileForm.value.address;
      alert('Profile updated successfully!');
    }
  }

  onRegisterSubmit() {
    if (this.registerForm.valid) {
      console.log('Registration form submitted:', this.registerForm.value);
      this.showVerification = true;
    }
  }

  onVerifySubmit() {
    if (this.verificationForm.valid) {
      const code = Object.values(this.verificationForm.value).join('');
      console.log('Verification code submitted:', code);
      alert('Account verified successfully!');
      this.showVerification = false;
    }
  }

  resetForm() {
    this.profileForm.reset({
      user_type: 'customer',
      full_name: this.profile.name,
      email: this.profile.email,
      phone: this.profile.phone,
      address: this.profile.address
    });
  }

  resendCode() {
    console.log('Resending verification code...');
    alert('New verification code sent!');
  }

  onVerificationInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;
    
    if (value.length === 1 && index < 5) {
      const nextInput = document.querySelector(`[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        nextInput.focus();
      }
    }
    
    this.verificationCode[index] = value;
    this.verificationForm.get(`code${index}`)?.setValue(value);
  }
}