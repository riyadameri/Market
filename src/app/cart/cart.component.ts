import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../header/header.component";

interface CartItem {
  productId: number;
  name: string;
  imageUrl: string;
  brand: string;
  rentalPrice: number;
  rentalPeriod: string;
  quantity: number;
  size?: string;
  color?: string;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  cartItems: CartItem[] = [
    {
      productId: 1,
      name: 'Premium Leather Jacket',
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      brand: 'Urban Styles',
      rentalPrice: 29.99,
      rentalPeriod: '1 week',
      quantity: 1,
      size: 'M',
      color: 'Black'
    },
    {
      productId: 15,
      name: 'Designer Handbag',
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      brand: 'Luxury Dresses',
      rentalPrice: 59.99,
      rentalPeriod: '2 weeks',
      quantity: 1,
      color: 'Black'
    }
  ];

  get subtotal(): number {
    return this.cartItems.reduce((sum, item) => sum + (item.rentalPrice * item.quantity), 0);
  }

  get estimatedTax(): number {
    return this.subtotal * 0.08; // Assuming 8% tax
  }

  get total(): number {
    return this.subtotal + this.estimatedTax;
  }

  removeItem(index: number): void {
    this.cartItems.splice(index, 1);
  }

  updateQuantity(item: CartItem, newQuantity: number): void {
    if (newQuantity > 0) {
      item.quantity = newQuantity;
    }
  }

  proceedToCheckout(): void {
    console.log('Proceeding to checkout with items:', this.cartItems);
    // In a real app, you would navigate to checkout page
  }
}