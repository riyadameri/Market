import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  mobileMenuOpen = false;
  showStatesFilter = false;
  showClothingFilter = false;
  stateSearch = '';
  searchQuery = '';
  currentRoute = '';

  // User data with default values
  userData: any = JSON.parse(localStorage.getItem('user') || '{}');
  defaultProfileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  // Algerian states
  algerianStates = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 
    'Biskra', 'Béchar', 'Blida', 'Bouira', 'Tamanrasset', 'Tébessa',
    'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Algiers', 'Djelfa', 'Jijel',
    'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla',
    'Oran', 'El Bayadh', 'Illizi', 'Bordj Bou Arréridj', 'Boumerdès',
    'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued', 'Khenchela',
    'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma',
    'Aïn Témouchent', 'Ghardaïa', 'Relizane'
  ];

  // Clothing categories
  clothingCategories = [
    'Traditional Algerian', 'Modern Fashion', 'Casual Wear', 
    'Formal Wear', 'Sports Wear', 'Winter Collection',
    'Summer Collection', 'Kids Fashion', 'Accessories'
  ];

  // Algerian traditional clothing
  algerianTraditional = [
    'Karakou', 'Chedda', 'Djellaba', 'Gandoura', 'Burnous',
    'Haik', 'Seroual', 'Fouta', 'Takchita', 'Blousa'
  ];

  filteredStates = [...this.algerianStates];

  constructor(private router: Router) {}

  ngOnInit() {
    this.currentRoute = this.router.url;
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  // User methods
  isUserSeller() {
    return this.userData && this.userData.role === 'seller';
  }

  isLoggedIn() {
    return !!this.userData && !!this.userData.email;
  }

  getUserFirstName() {
    return this.userData?.firstName || 'Guest';
  }

  getUserLastName() {
    return this.userData?.lastName || '';
  }

  getUserEmail() {
    return this.userData?.email || '';
  }

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

  logout() {
    localStorage.removeItem('user');
    this.userData = {};
    this.router.navigate(['/login']);
  }

  // UI methods
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  toggleStatesFilter() {
    this.showStatesFilter = !this.showStatesFilter;
    if (this.showStatesFilter) {
      this.showClothingFilter = false;
      this.stateSearch = '';
      this.filteredStates = [...this.algerianStates];
    }
  }

  toggleClothingFilter() {
    this.showClothingFilter = !this.showClothingFilter;
    if (this.showClothingFilter) {
      this.showStatesFilter = false;
    }
  }

  // Search and filter methods
  filterStates() {
    this.filteredStates = this.stateSearch 
      ? this.algerianStates.filter(state =>
          state.toLowerCase().includes(this.stateSearch.toLowerCase())
      ) : [...this.algerianStates];
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], { 
        queryParams: { q: this.searchQuery } 
      });
    }
  }

  filterByState(state: string) {
    this.router.navigate(['/products'], { 
      queryParams: { state } 
    });
    this.showStatesFilter = false;
  }

  filterByCategory(category: string) {
    this.router.navigate(['/products'], { 
      queryParams: { category } 
    });
    this.showClothingFilter = false;
  }

  filterByTraditional(type: string) {
    this.router.navigate(['/products'], { 
      queryParams: { type } 
    });
    this.showClothingFilter = false;
  }

  clearFilters() {
    this.router.navigate(['/products']);
    this.showStatesFilter = false;
    this.showClothingFilter = false;
  }
}