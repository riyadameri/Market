import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AdvertisemenDisplayBarComponent } from "../advertisemen-display-bar/advertisemen-display-bar.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserfooterComponent } from '../userfooter/userfooter.component';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent, 
    AdvertisemenDisplayBarComponent, 
    CommonModule,
    RouterModule,
    UserfooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  products = [
    {
      _id: 1,
      name: 'Premium Leather Jacket',
      description: 'Handcrafted genuine leather jacket with premium stitching',
      price: 89.99,
      originalPrice: 120.99,
      rentalPrice: 29.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Outerwear',
      stock: 15,
      discount: 17,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.8,
      reviewCount: 124,
      colors: ['Black', 'Brown', 'Tan'],
      sizes: ['S', 'M', 'L', 'XL'],
      rentalPeriods: ['3 days', '1 week', '2 weeks']
    },
    // Original 10 products here...
    {
      _id: 11,
      name: 'Vintage Leather Boots',
      description: 'Durable and stylish leather boots for all occasions',
      price: 129.99,
      originalPrice: 159.99,
      rentalPrice: 39.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Footwear',
      stock: 10,
      discount: 19,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.6,
      reviewCount: 85,
      colors: ['Brown', 'Black'],
      sizes: ['7', '8', '9', '10', '11'],
      rentalPeriods: ['1 week', '2 weeks']
    },
    {
      _id: 12,
      name: 'Casual Sneakers',
      description: 'Comfortable sneakers for everyday wear',
      price: 59.99,
      originalPrice: 79.99,
      rentalPrice: 19.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Footwear',
      stock: 25,
      discount: 25,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Street Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.3,
      reviewCount: 60,
      colors: ['White', 'Black', 'Gray'],
      sizes: ['6', '7', '8', '9', '10'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 13,
      name: 'Classic Fedora Hat',
      description: 'Timeless fedora hat for a sophisticated look',
      price: 39.99,
      originalPrice: 49.99,
      rentalPrice: 14.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Accessories',
      stock: 30,
      discount: 20,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.7,
      reviewCount: 50,
      colors: ['Black', 'Brown', 'Gray'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week']
    },
    {
      _id: 14,
      name: 'Wool Scarf',
      description: 'Soft and warm wool scarf for chilly days',
      price: 24.99,
      originalPrice: 34.99,
      rentalPrice: 9.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Accessories',
      stock: 40,
      discount: 29,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Street Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.5,
      reviewCount: 35,
      colors: ['Red', 'Blue', 'Gray'],
      sizes: ['One Size'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 15,
      name: 'Designer Handbag',
      description: 'Elegant handbag with premium leather finish',
      price: 199.99,
      originalPrice: 249.99,
      rentalPrice: 59.99,
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      category: 'Accessories',
      stock: 5,
      discount: 20,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Luxury Dresses',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.9,
      reviewCount: 100,
      colors: ['Black', 'Beige', 'Red'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week', '2 weeks']
    },
    {
      _id: 16,
      name: 'Silk Tie',
      description: 'Premium silk tie for formal occasions',
      price: 29.99,
      originalPrice: 39.99,
      rentalPrice: 9.99,
      imageUrl: 'https://i.pinimg.com/736x/0e/91/1e/0e911e42d9a12762b00cc6f622db8ae6.jpg',
      category: 'Accessories',
      stock: 20,
      discount: 25,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Executive Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.4,
      reviewCount: 40,
      colors: ['Red', 'Blue', 'Black'],
      sizes: ['One Size'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 17,
      name: 'Winter Gloves',
      description: 'Warm and durable gloves for winter',
      price: 19.99,
      originalPrice: 29.99,
      rentalPrice: 7.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Accessories',
      stock: 50,
      discount: 33,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.2,
      reviewCount: 25,
      colors: ['Black', 'Gray', 'Brown'],
      sizes: ['S', 'M', 'L'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 18,
      name: 'Formal Belt',
      description: 'Classic leather belt for formal attire',
      price: 49.99,
      originalPrice: 69.99,
      rentalPrice: 19.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Accessories',
      stock: 30,
      discount: 29,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Street Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.3,
      reviewCount: 30,
      colors: ['Black', 'Brown'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week']
    },
    {
      _id: 19,
      name: 'Casual Backpack',
      description: 'Stylish and spacious backpack for daily use',
      price: 79.99,
      originalPrice: 99.99,
      rentalPrice: 24.99,
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      category: 'Accessories',
      stock: 15,
      discount: 20,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Luxury Dresses',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.8,
      reviewCount: 70,
      colors: ['Black', 'Gray', 'Navy'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week', '2 weeks']
    },
    {
      _id: 20,
      name: 'Wool Beanie',
      description: 'Cozy wool beanie for cold weather',
      price: 14.99,
      originalPrice: 19.99,
      rentalPrice: 4.99,
      imageUrl: 'https://i.pinimg.com/736x/0e/91/1e/0e911e42d9a12762b00cc6f622db8ae6.jpg',
      category: 'Accessories',
      stock: 40,
      discount: 25,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Executive Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.5,
      reviewCount: 20,
      colors: ['Black', 'Gray', 'Navy'],
      sizes: ['One Size'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 21,
      name: 'Leather Wallet',
      description: 'Premium leather wallet with multiple compartments',
      price: 49.99,
      originalPrice: 69.99,
      rentalPrice: 19.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Accessories',
      stock: 20,
      discount: 29,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.7,
      reviewCount: 45,
      colors: ['Black', 'Brown'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week']
    },
    {
      _id: 22,
      name: 'Formal Watch',
      description: 'Elegant watch for formal occasions',
      price: 199.99,
      originalPrice: 249.99,
      rentalPrice: 59.99,
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      category: 'Accessories',
      stock: 10,
      discount: 20,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Luxury Dresses',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.9,
      reviewCount: 100,
      colors: ['Silver', 'Gold', 'Black'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week', '2 weeks']
    },
    {
      _id: 23,
      name: 'Casual Sunglasses',
      description: 'Trendy sunglasses for everyday wear',
      price: 29.99,
      originalPrice: 39.99,
      rentalPrice: 9.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Accessories',
      stock: 30,
      discount: 25,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Street Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.4,
      reviewCount: 40,
      colors: ['Black', 'Brown', 'Gray'],
      sizes: ['One Size'],
      rentalPeriods: ['3 days', '1 week']
    },
    {
      _id: 24,
      name: 'Leather Backpack',
      description: 'Stylish leather backpack for work and travel',
      price: 149.99,
      originalPrice: 199.99,
      rentalPrice: 49.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Accessories',
      stock: 15,
      discount: 25,
      isFeatured: true,
      isAvailable: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.8,
      reviewCount: 70,
      colors: ['Black', 'Brown'],
      sizes: ['One Size'],
      rentalPeriods: ['1 week', '2 weeks']
    },
    {
      _id: 25,
      name: 'Wool Socks',
      description: 'Warm and comfortable wool socks for winter',
      price: 9.99,
      originalPrice: 14.99,
      rentalPrice: 3.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Accessories',
      stock: 50,
      discount: 33,
      isFeatured: false,
      isAvailable: true,
      brand: {
        name: 'Street Style',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg'
      },
      rating: 4.2,
      reviewCount: 25,
      colors: ['Black', 'Gray', 'Brown'],
      sizes: ['S', 'M', 'L'],
      rentalPeriods: ['3 days', '1 week']
    }
  ];

  ads = [
    {
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Summer Collection',
      description: 'New arrivals for the sunny season',
      link: '/summer-collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Designer Sale',
      description: 'Up to 40% off premium brands',
      link: '/designer-sale'
    },
    {
      image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Weekend Special',
      description: 'Limited time offers just for you',
      link: '/weekend-special'
    },
    {
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Accessories',
      description: 'Complete your look',
      link: '/accessories'
    },
    {
      image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Luxury Watches',
      description: 'Timeless elegance',
      link: '/watches'
    },
    {
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Shoes & Boots',
      description: 'Step out in style',
      link: '/footwear'
    },
    {
      image: 'https://images.unsplash.com/photo-1595341595379-cf0f2f1a457b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Formal Wear',
      description: 'Perfect for special occasions',
      link: '/formal-wear'
    },
    {
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Casual Outfits',
      description: 'Comfort meets style',
      link: '/casual'
    }
  ];


  getDiscountedPrice(originalPrice: number, discount: number): number {
    return originalPrice - (originalPrice * discount / 100);
  }
  addToCart(product: any) {
    console.log('Product added to cart:', product);
  }
  scrollAds(index: number) {
    const adContainer = document.querySelector('.ad-container') as HTMLElement;
    const firstAd = adContainer.firstElementChild as HTMLElement;
    adContainer.appendChild(firstAd);
  }
  navigateToAd(link: string) {
    console.log('Navigating to:', link);
    // Implement navigation logic here, e.g., using Angular Router
  }
}