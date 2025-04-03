import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-advertisemen-display-bar',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './advertisemen-display-bar.component.html',
  styleUrl: './advertisemen-display-bar.component.css'
})
export class AdvertisemenDisplayBarComponent {
  
  currentIndex = 0;
  autoSlideInterval: any;
  showProductModal = false;
  selectedProduct: any = null;
  quantity = 1;
  selectedColor: string = '';
  selectedSize: string = '';
  orderNumber: string = '';

  featuredProducts = [
    {
      id: 1,
      name: 'Premium Leather Jacket',
      description: 'Handcrafted genuine leather jacket with premium stitching',
      price: 249.99,
      originalPrice: 299.99,
      imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
      category: 'Outerwear',
      stock: 15,
      discount: 17,
      isFeatured: true,
      brand: {
        name: 'Urban Styles',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Ay8ALtHp7dQQ7kNvgEVsC6w&_nc_oc=AdkKIkNc9AOzdFRg9y5cCS4NNejJUJ8Ddce4QVnrFiLOUkDvbQ5tVsGt8l871SvnrXo&_nc_zt=23&_nc_ht=scontent.fogx1-2.fna&_nc_gid=d1m68p8zffSVZJNeCxzkWw&oh=00_AYFn7tnAdLappCUoYZ_xUTRWIZILAZQQq7EDUaya8OZCJg&oe=67EF13B7'
      },
      rating: 4.8,
      reviewCount: 124,
      colors: ['Black', 'Brown', 'Tan'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 2,
      name: 'Wireless Noise-Canceling Headphones',
      description: '40mm drivers with active noise cancellation technology',
      price: 179.99,
      originalPrice: 229.99,
      imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
      category: 'Electronics',
      stock: 32,
      discount: 22,
      isFeatured: true,
      brand: {
        name: 'AudioPro',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Ay8ALtHp7dQQ7kNvgEVsC6w&_nc_oc=AdkKIkNc9AOzdFRg9y5cCS4NNejJUJ8Ddce4QVnrFiLOUkDvbQ5tVsGt8l871SvnrXo&_nc_zt=23&_nc_ht=scontent.fogx1-2.fna&_nc_gid=d1m68p8zffSVZJNeCxzkWw&oh=00_AYFn7tnAdLappCUoYZ_xUTRWIZILAZQQq7EDUaya8OZCJg&oe=67EF13B7'
      },
      rating: 4.6,
      reviewCount: 89,
      colors: ['Black', 'Silver', 'Blue'],
      warranty: '2 years'
    },
    {
      id: 3,
      name: 'Organic Cotton T-Shirt',
      description: '100% organic cotton with eco-friendly dyes',
      price: 29.99,
      originalPrice: 39.99,
      imageUrl: 'https://i.pinimg.com/736x/0e/91/1e/0e911e42d9a12762b00cc6f622db8ae6.jpg',
      category: 'Apparel',
      stock: 42,
      discount: 25,
      isFeatured: true,
      brand: {
        name: 'EcoWear',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Ay8ALtHp7dQQ7kNvgEVsC6w&_nc_oc=AdkKIkNc9AOzdFRg9y5cCS4NNejJUJ8Ddce4QVnrFiLOUkDvbQ5tVsGt8l871SvnrXo&_nc_zt=23&_nc_ht=scontent.fogx1-2.fna&_nc_gid=d1m68p8zffSVZJNeCxzkWw&oh=00_AYFn7tnAdLappCUoYZ_xUTRWIZILAZQQq7EDUaya8OZCJg&oe=67EF13B7'
      },
      rating: 4.7,
      reviewCount: 56,
      colors: ['White', 'Gray', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      materials: ['100% Organic Cotton']
    },
    {
      id: 4,
      name: 'Organic Cotton T-Shirt',
      description: '100% organic cotton with eco-friendly dyes',
      price: 29.99,
      originalPrice: 39.99,
      imageUrl: 'https://i.pinimg.com/736x/06/5d/2f/065d2fa3de9c0618dae1075f4e8cd94b.jpg',
      category: 'Apparel',
      stock: 42,
      discount: 25,
      isFeatured: true,
      brand: {
        name: 'EcoWear',
        logoUrl: 'https://scontent.fogx1-2.fna.fbcdn.net/v/t39.30808-6/484531915_1355626512127491_8033954014185430900_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=Ay8ALtHp7dQQ7kNvgEVsC6w&_nc_oc=AdkKIkNc9AOzdFRg9y5cCS4NNejJUJ8Ddce4QVnrFiLOUkDvbQ5tVsGt8l871SvnrXo&_nc_zt=23&_nc_ht=scontent.fogx1-2.fna&_nc_gid=d1m68p8zffSVZJNeCxzkWw&oh=00_AYFn7tnAdLappCUoYZ_xUTRWIZILAZQQq7EDUaya8OZCJg&oe=67EF13B7'
      },
      rating: 4.7,
      reviewCount: 56,
      colors: ['White', 'Gray', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      materials: ['100% Organic Cotton']
    }
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.featuredProducts.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.featuredProducts.length) % this.featuredProducts.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
    // Reset timer when manually changing slides
    clearInterval(this.autoSlideInterval);
    this.startAutoSlide();
  }

  calculateDiscount(original: number, current: number): number {
    return Math.round(((original - current) / original) * 100);
  }
  openProductModal(product: any) {
    this.selectedProduct = product;
    this.selectedColor = product.colors?.[0] || '';
    this.selectedSize = product.sizes?.[0] || '';
    this.showProductModal = true;
    this.generateOrderNumber();
    // Pause auto-slide when modal is open
    clearInterval(this.autoSlideInterval);
  }

  closeProductModal() {
    this.showProductModal = false;
    // Resume auto-slide when modal is closed
    this.startAutoSlide();
  }

  generateOrderNumber(): string {
    if (!this.orderNumber) {
      const date = new Date();
      const prefix = 'ORD';
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      this.orderNumber = `${prefix}-${date.getFullYear()}${(date.getMonth()+1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}-${randomNum}`;
    }
    return this.orderNumber;
  }

  increaseQuantity() {
    if (this.quantity < (this.selectedProduct?.stock || 10)) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  printPaymentInstructions() {
    window.print();
  }

  confirmPayment() {
    this.closeProductModal();
    alert(`Order ${this.orderNumber} has been confirmed. Please proceed with payment to the supplier.`);
  }

}
