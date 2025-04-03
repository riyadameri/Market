import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule,HeaderComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsForm: FormGroup;
  isEditing = false;
  isLoading = false;
  activeTab = 'account';

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      // Account Info
      firstName: ['Alex', [Validators.required]],
      lastName: ['Johnson', [Validators.required]],
      email: ['alex.johnson@example.com', [Validators.required, Validators.email]],
      phone: ['+1 (555) 123-4567'],
      
      // Notification Preferences
      emailNotifications: [true],
      smsNotifications: [false],
      promotionalEmails: [true],
      rentalReminders: [true],
      
      // Payment Methods
      cardNumber: ['•••• •••• •••• 4242'],
      cardExpiry: ['12/24'],
      cardName: ['Alex Johnson'],
      
      // Shipping Address
      addressLine1: ['123 Fashion Avenue'],
      addressLine2: ['Apt 4B'],
      city: ['New York'],
      state: ['NY'],
      zipCode: ['10001'],
      country: ['United States']
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
  }

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onSubmit() {
    if (this.settingsForm.invalid) return;
    
    this.isLoading = true;
    // Simulate API call
    setTimeout(() => {
      console.log('Settings updated:', this.settingsForm.value);
      this.isLoading = false;
      this.isEditing = false;
    }, 1500);
  }

  addPaymentMethod() {
    console.log('Adding new payment method');
  }

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      console.log('Account deletion requested');
    }
  }
}