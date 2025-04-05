import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  // User type selection
  userType: 'customer' | 'seller' = 'customer';
  
  // Personal information fields
  idNumber = '';
  firstName = '';
  lastName = '';
  phoneNumber = '';
  birthDate = '';
  
  // Seller-specific fields
  shopName = '';
  shopDescription = '';
  selectedRegions: string[] = [];
  tempSelectedRegions: string[] = [];

  // Account details
  email = '';
  password = '';
  confirmPassword = '';
  
  // UI state
  showPassword = false;
  agreeTerms = false;
  isLoading = false;
  currentStep = 1;
  loadingMessage = '';
  
  // Image handling
  profileImage: File | null = null;
  profileImageName = '';
  profileImagePreview: string | null = null;
  shopLogo: File | null = null;
  shopLogoName = '';
  shopLogoPreview: string | null = null;
  
  // Verification
  showVerification = false;
  verificationCode: string[] = Array(6).fill('');
  canResendCode = true;
  verificationError = '';
  resendMessage = '';
  userId: string | null = null;
  
  // Algerian regions list
  algerianRegions = [
    'Temacine','Tougourt','Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 
    'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 
    'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 
    'Sidi Bel Abbès', 'Annaba', 'Guelma', 'Constantine', 'Médéa', 'Mostaganem', 
    'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 
    'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela', 
    'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 
    'Ghardaïa', 'Relizane'
  ];

  constructor(private router: Router, private authService: AuthService) {}

  /**
   * Toggles password visibility
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Moves to the next step in the registration process
   */
  nextStep(): void {
    if (!this.idNumber || !this.firstName || !this.lastName || !this.phoneNumber || !this.birthDate) {
      this.verificationError = 'Please fill all required personal information fields';
      return;
    }

    if (!this.profileImage) {
      this.verificationError = 'Please upload a profile image';
      return;
    }

    if (this.userType === 'seller' && (!this.shopName || this.selectedRegions.length === 0)) {
      this.verificationError = 'Please fill all seller information including at least one region';
      return;
    }

    this.currentStep = 2;
    this.verificationError = '';
  }

  /**
   * Returns to the previous step
   */
  prevStep(): void {
    this.currentStep = 1;
    this.verificationError = '';
  }

  /**
   * Handles profile image selection
   * @param event - File input change event
   */
  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.profileImage = input.files[0];
      this.profileImageName = this.profileImage.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.profileImage);
    }
  }

  /**
   * Handles shop logo selection
   * @param event - File input change event
   */
  onShopLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.shopLogo = input.files[0];
      this.shopLogoName = this.shopLogo.name;
      
      const reader = new FileReader();
      reader.onload = () => {
        this.shopLogoPreview = reader.result as string;
      };
      reader.readAsDataURL(this.shopLogo);
    }
  }

  /**
   * Handles region selection changes
   * @param event - Select change event
   */
  onRegionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.tempSelectedRegions = Array.from(select.selectedOptions).map(option => option.value);
  }

  /**
   * Confirms selected regions
   */
  confirmRegions(): void {
    const newRegions = this.tempSelectedRegions.filter(region => 
      !this.selectedRegions.includes(region));
    
    this.selectedRegions = [...this.selectedRegions, ...newRegions];
    this.tempSelectedRegions = [];
  }

  /**
   * Removes a selected region
   * @param region - The region to remove
   */
  removeRegion(region: string): void {
    this.selectedRegions = this.selectedRegions.filter(r => r !== region);
  }

  /**
   * Submits the registration form
   */
  onSubmit(): void {
    this.verificationError = '';
    
    if (!this.email || !this.password || !this.confirmPassword) {
      this.verificationError = 'Please fill all account details';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.verificationError = 'Passwords do not match!';
      return;
    }

    if (this.password.length < 8) {
      this.verificationError = 'Password must be at least 8 characters';
      return;
    }

    if (!this.agreeTerms) {
      this.verificationError = 'You must agree to the terms and conditions';
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Creating your account...';

    const formData = new FormData();
    formData.append('role', this.userType);
    formData.append('idNumber', this.idNumber);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('phone', this.phoneNumber);
    formData.append('birthDate', this.birthDate);
    formData.append('email', this.email);
    formData.append('password', this.password);
    
    if (this.profileImage) {
      formData.append('profileImage', this.profileImage);
    }

    if (this.userType === 'seller') {
      formData.append('shopName', this.shopName);
      formData.append('shopDescription', this.shopDescription);
      formData.append('regions', JSON.stringify(this.selectedRegions));
      
      if (this.shopLogo) {
        formData.append('shopImage', this.shopLogo);
      }
    }

    this.authService.register(formData).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.loadingMessage = '';
        
        if (response.success) {
          this.showVerification = true;
          this.userId = response.userId;
        } else {
          this.verificationError = response.message || 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.verificationError = error.error?.message || 'Server error during registration. Please try again later.';
        console.error('Registration error:', error);
      }
    });
  }

  /**
   * Handles verification code input
   * @param index - Index of the digit being entered
   * @param value - The entered digit
   */
  onVerificationInput(index: number, value: string): void {
    if (value && !/^\d$/.test(value)) {
      this.verificationCode[index] = '';
      return;
    }
  
    const newCode = [...this.verificationCode];
    newCode[index] = value;
    this.verificationCode = newCode;
    
    this.verificationError = '';
  
    if (value && index < this.verificationCode.length - 1) {
      const nextInput = document.querySelector(`.verification-input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) {
        setTimeout(() => nextInput.focus(), 0);
      }
    }
  
    if (this.checkVerificationCode()) {
      this.verifyAccount();
    }
  }

  /**
   * Track by function for ngFor
   * @param index - Index of the item
   * @param item - The item itself
   * @returns The index
   */
  trackByIndex(index: number, item: any): number {
    return index;
  }

  /**
   * Handles keyboard navigation in verification code inputs
   * @param index - Current input index
   * @param event - Keyboard event
   */
  onVerificationKeyDown(index: number, event: KeyboardEvent): void {
    if (event.key === 'ArrowRight' && index < this.verificationCode.length - 1) {
      const nextInput = document.querySelector(`.verification-input[data-index="${index + 1}"]`) as HTMLInputElement;
      if (nextInput) nextInput.focus();
      event.preventDefault();
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.querySelector(`.verification-input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) prevInput.focus();
      event.preventDefault();
    }

    if (event.key === 'Backspace' && !this.verificationCode[index] && index > 0) {
      this.verificationCode[index - 1] = '';
      const prevInput = document.querySelector(`.verification-input[data-index="${index - 1}"]`) as HTMLInputElement;
      if (prevInput) {
        setTimeout(() => prevInput.focus(), 0);
      }
    }
  }

  /**
   * Handles paste event for verification code
   * @param event - Clipboard event
   */
  onVerificationPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pasteData = event.clipboardData?.getData('text');
    
    if (pasteData && /^\d{6}$/.test(pasteData)) {
      this.verificationCode = pasteData.split('').slice(0, 6);
      
      const lastInput = document.querySelector(`.verification-input[data-index="5"]`) as HTMLInputElement;
      if (lastInput) lastInput.focus();
    }
  }

  /**
   * Checks if verification code is complete
   * @returns True if all digits are entered
   */
  checkVerificationCode(): boolean {
    return this.verificationCode.every(digit => digit !== '');
  }

  /**
   * Verifies the account with the entered code
   */
  verifyAccount(): void {
    if (!this.checkVerificationCode()) {
      this.verificationError = 'Please enter the complete verification code';
      return;
    }

    if (!this.userId) {
      this.verificationError = 'Session error. Please try registering again.';
      return;
    }

    this.isLoading = true;
    this.loadingMessage = 'Verifying your account...';
    const code = this.verificationCode.join('');

    this.authService.verifyEmail(this.userId, code).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.loadingMessage = '';
        
        if (response.success) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          console.log('User data:', response.token);
          
          const redirectUrl = response.user.role === 'seller' ? '/login' : '/dashboard';
          this.router.navigate([redirectUrl]);
        } else {
          this.verificationError = response.message || 'Verification failed. Please try again.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.loadingMessage = '';
        this.verificationError = error.error?.message || 'Server error during verification. Please try again.';
        console.error('Verification error:', error);
      }
    });
  }

  /**
   * Resends verification code
   */
  resendCode(): void {
    if (!this.canResendCode || !this.userId) return;

    this.isLoading = true;
    this.resendMessage = 'Sending new code...';

    setTimeout(() => {
      this.isLoading = false;
      this.canResendCode = false;
      this.resendMessage = 'New code sent!';
      this.verificationCode = Array(6).fill('');

      setTimeout(() => {
        this.canResendCode = true;
        this.resendMessage = '';
      }, 30000);
    }, 1000);
  }

  /**
   * Checks if the current step form is valid
   * @returns True if the form is valid
   */
  isFormValid(): boolean {
    if (this.currentStep === 1) {
      return !!this.idNumber && !!this.firstName && !!this.lastName && 
             !!this.phoneNumber && !!this.birthDate && !!this.profileImage &&
             (this.userType !== 'seller' || (!!this.shopName && this.selectedRegions.length > 0));
    }
    
    return !!this.email && !!this.password && !!this.confirmPassword && 
           this.password === this.confirmPassword && this.password.length >= 8 && this.agreeTerms;
  }
}