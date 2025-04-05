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

  // Get user data from localStorage
  userData: any = JSON.parse(localStorage.getItem('user') || '{}');
  defaultProfileImage = 'assets/images/default-profile.png';

  // Initialize profile data from localStorage
  profile = {
    name: this.userData.firstName + ' ' + this.userData.lastName,
    email: this.userData.email,
    joinDate: new Date(this.userData.dateOfRegistration || this.userData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    phone: this.userData.phone,
    address: this.userData.regions?.join(', ') || 'Address not specified'
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
    }
  ];

  wishlist = [
    {
      name: 'Leather Crossbody Bag',
      price: 129.99,
      image: 'https://i.pinimg.com/736x/92/27/6b/92276bdd670feaa61dd16c010fbe7be5.jpg'
    }
  ];

  settings = {
    notifications: 'all',
    theme: 'light',
    newsletter: true,
    promotions: true
  };

  constructor(private fb: FormBuilder) {
    // Profile Form initialized with user data
    this.profileForm = this.fb.group({
      user_type: [this.userData.role || 'customer', Validators.required],
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

  // Get user profile image or default
  getProfileImage() {
    if (this.userData?.image) {
      // Check if it's already a full URL (might be from social login)
      if (this.userData.image.startsWith('http')) {
        return this.userData.image;
      }
      // Otherwise, construct the URL to your backend
      return `http://localhost:3000/uploads/${this.userData.image.split('/').pop()}`;
    }
    return this.defaultProfileImage;
  }

  // Check if user is a seller
  isUserSeller(): boolean {
    return this.userData.role === 'seller';
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
      // Update user data in localStorage
      const updatedUser = {
        ...this.userData,
        firstName: this.profileForm.value.full_name.split(' ')[0],
        lastName: this.profileForm.value.full_name.split(' ')[1] || '',
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        regions: this.profileForm.value.address.split(', ')
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      this.userData = updatedUser;
      
      // Update profile display
      this.profile = {
        ...this.profile,
        name: this.profileForm.value.full_name,
        email: this.profileForm.value.email,
        phone: this.profileForm.value.phone,
        address: this.profileForm.value.address
      };

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
      user_type: this.userData.role || 'customer',
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