import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

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
  
  // Image handling
  profileImage: File | null = null;
  profileImageName = '';
  profileImagePreview: string | null = null;
  shopImage: File | null = null;
  shopImageName = '';
  shopImagePreview: string | null = null;
  
  // Verification
  showVerification = false;
  verificationCode: string[] = Array(6).fill('');
  canResendCode = true;
  verificationError = '';
  resendMessage = '';
  
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

  constructor(private router: Router) {}

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
    // Validate step 1 fields
    if (!this.idNumber || !this.firstName || !this.lastName || !this.phoneNumber || !this.birthDate || !this.profileImage) {
      this.verificationError = 'Please fill all required fields';
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
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.profileImage);
    }
  }

  /**
   * Handles shop image selection
   * @param event - File input change event
   */
  onShopImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.shopImage = input.files[0];
      this.shopImageName = this.shopImage.name;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.shopImagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.shopImage);
    }
  }

  /**
   * Handles region selection changes
   * @param event - Select change event
   */
  onRegionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedRegions = Array.from(select.selectedOptions).map(option => option.value);
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
    
    // Basic validation
    if (this.password !== this.confirmPassword) {
      this.verificationError = 'Passwords do not match!';
      return;
    }

    if (!this.agreeTerms) {
      this.verificationError = 'You must agree to the terms and conditions';
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.showVerification = true;
    }, 1000);
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
    const pasteData = event.clipboardData?.getData('text');
    
    if (pasteData && /^\d{6}$/.test(pasteData)) {
      pasteData.split('').forEach((char, i) => {
        if (i < this.verificationCode.length) {
          this.verificationCode[i] = char;
        }
      });

      this.verificationCode = [...this.verificationCode];

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

    this.isLoading = true;

    // Simulate verification
    setTimeout(() => {
      this.isLoading = false;
      alert('Account verified successfully! Redirecting to dashboard...');
      this.router.navigate(['/dashboard']);
    }, 1000);
  }
  onRegionSelect(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.tempSelectedRegions = Array.from(select.selectedOptions, option => option.value);
  }
  /**
   * Resends verification code
   */
  resendCode(): void {
    if (!this.canResendCode) return;

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
  confirmRegions(): void {
    // تجنب التكرار
    const newRegions = this.tempSelectedRegions.filter(region => 
      !this.selectedRegions.includes(region));
    
    this.selectedRegions = [...this.selectedRegions, ...newRegions];
    this.tempSelectedRegions = [];
  }

}