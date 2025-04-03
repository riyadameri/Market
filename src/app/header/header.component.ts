import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule  } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  mobileMenuOpen = false;
  showStatesFilter = false;
  showClothingFilter = false;
  stateSearch = '';
  isAdmin = true ;
  currentRoute = window.location.pathname;

  // Original Algerian states
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

  // Filtered states based on search
  filteredStates = [...this.algerianStates];

  // Clothing categories
  clothingCategories = [
    'Traditional Algerian', 'Modern Fashion', 'Casual Wear', 
    'Formal Wear', 'Sports Wear', 'Winter Collection',
    'Summer Collection', 'Kids Fashion', 'Accessories'
  ];

  // Algerian traditional clothing subcategories
  algerianTraditional = [
    'Karakou', 'Chedda', 'Djellaba', 'Gandoura', 'Burnous',
    'Haik', 'Seroual', 'Fouta', 'Takchita', 'Blousa'
  ];

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

  filterStates() {
    if (!this.stateSearch) {
      this.filteredStates = [...this.algerianStates];
      return;
    }
    
    this.filteredStates = this.algerianStates.filter(state =>
      state.toLowerCase().includes(this.stateSearch.toLowerCase())
    );
  }

  filterByState(state: string) {
    console.log('Filtering by state:', state);
    // Implement your filtering logic here
    this.showStatesFilter = false;
  }

  filterByCategory(category: string) {
    console.log('Filtering by category:', category);
    // Implement your filtering logic here
    this.showClothingFilter = false;
  }

  filterByTraditional(type: string) {
    console.log('Filtering by traditional:', type);
    // Implement your filtering logic here
    this.showClothingFilter = false;
  }

  clearFilters() {
    console.log('Clearing all filters');
    // Implement your clear filters logic here
    this.showStatesFilter = false;
    this.showClothingFilter = false;
  }
}