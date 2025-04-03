import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
interface FavoriteItem {
  productId: number;
  name: string;
  imageUrl: string;
  brand: string;
  rentalPrice: number;
  originalPrice: number;
  category: string;
  isAvailable: boolean;
}

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent {
  favoriteItems: FavoriteItem[] = [
    {
      productId: 1,
      name: 'Premium Leather Jacket',
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      brand: 'Urban Styles',
      rentalPrice: 29.99,
      originalPrice: 120.99,
      category: 'Outerwear',
      isAvailable: true
    },
    {
      productId: 15,
      name: 'Designer Handbag',
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      brand: 'Luxury Dresses',
      rentalPrice: 59.99,
      originalPrice: 249.99,
      category: 'Accessories',
      isAvailable: true
    },
    {
      productId: 22,
      name: 'Formal Watch',
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      brand: 'Luxury Dresses',
      rentalPrice: 59.99,
      originalPrice: 249.99,
      category: 'Accessories',
      isAvailable: false
    }
  ];

  removeFromFavorites(productId: number): void {
    this.favoriteItems = this.favoriteItems.filter(item => item.productId !== productId);
  }

  moveToCart(item: FavoriteItem): void {
    console.log('Moving to cart:', item);
    // In a real app, you would add to cart and possibly remove from favorites
    // this.removeFromFavorites(item.productId);
  }
}