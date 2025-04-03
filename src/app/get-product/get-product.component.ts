import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-get-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,HeaderComponent],
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.css']
})
export class GetProductComponent {
  productId: string | null = null;
  product: any = null;
  selectedSize: string = '';
  selectedColor: string = '';
  selectedRentalPeriod: string = '';
  quantity: number = 1;
  relatedProducts: any[] = [];
  showPaymentModal: boolean = false;
  orderNumber: string = '';
  addToCartAnimation: boolean = false;
  wishlistAnimation: boolean = false;
  wishlistActive: boolean = false;

  constructor() {
    this.productId = '1';
    this.fetchProduct(this.productId);
    this.fetchRelatedProducts();
  }

  fetchProduct(productId: string | null) {
    if (productId) {
      const mockProducts = [
        {
          _id: 1,
          name: 'Premium Leather Jacket',
          description: 'Handcrafted genuine leather jacket with premium stitching.',
          detailedDescription: 'This premium leather jacket is crafted from top-grain cowhide leather that offers durability and a luxurious feel.',
          price: 89.99,
          originalPrice: 120.99,
          rentalPrice: 29.99,
          imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
          additionalImages: [
            'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
            'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
            'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg'
          ],
          category: 'Outerwear',
          stock: 15,
          discount: 17,
          isFeatured: true,
          isAvailable: true,
          brand: {
            name: 'Redox',
            logoUrl: 'https://redoxcsl.web.app/assets/redox-icon.png'
          },
          rating: 4.8,
          reviewCount: 124,
          colors: ['Black', 'Brown', 'Tan'],
          sizes: ['S', 'M', 'L', 'XL'],
          rentalPeriods: ['3 days', '1 week', '2 weeks'],
          specifications: {
            material: '100% Genuine Leather',
            lining: 'Polyester Quilted Lining',
            closure: 'Zipper',
            pockets: '4 (2 external, 2 internal)',
            careInstructions: 'Wipe clean with damp cloth.'
          },
          reviews: [
            {
              user: 'Alex Johnson',
              rating: 5,
              date: '2023-10-15',
              comment: 'Absolutely love this jacket!'
            },
            {
              user: 'Sarah Miller',
              rating: 4,
              date: '2023-09-28',
              comment: 'Great jacket, very stylish.'
            }
          ]
        }
      ];
      
      this.product = mockProducts.find(p => p._id == +productId) || null;
      
      if (this.product) {
        this.selectedColor = this.product.colors[0];
        this.selectedSize = this.product.sizes[0];
        this.selectedRentalPeriod = this.product.rentalPeriods[0];
      }
    }
  }

  fetchRelatedProducts() {
    this.relatedProducts = [
      {
        _id: 11,
        name: 'Vintage Leather Boots',
        description: 'Durable and stylish leather boots for all occasions',
        price: 129.99,
        originalPrice: 159.99,
        imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
        discount: 19,
        rating: 4.6
      },
      {
        _id: 15,
        name: 'Designer Handbag',
        description: 'Elegant handbag with premium leather finish',
        price: 199.99,
        originalPrice: 249.99,
        imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
        discount: 20,
        rating: 4.9
      },
      {
        _id: 22,
        name: 'Formal Watch',
        description: 'Elegant watch for formal occasions',
        price: 199.99,
        originalPrice: 249.99,
        imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
        discount: 20,
        rating: 4.9
      }
    ];
  }

  handleClick(event: MouseEvent, type: 'cart' | 'wishlist') {
    if (type === 'cart') {
      this.addToCartAnimation = true;
    } else {
      this.wishlistAnimation = true;
      this.wishlistActive = !this.wishlistActive;
    }

    // Get button position
    const button = event.target as HTMLElement;
    const rect = button.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // Get cart icon position (you'll need to add a cart icon in your header)
    const cartIcon = document.querySelector('.header-cart') as HTMLElement;
    const cartRect = cartIcon?.getBoundingClientRect();
    const endX = cartRect ? cartRect.left + cartRect.width / 2 : window.innerWidth - 50;
    const endY = cartRect ? cartRect.top + cartRect.height / 2 : 50;

    // Create flying item
    const flyItem = document.createElement('div');
    flyItem.className = 'animation-fly-item';
    flyItem.style.setProperty('--start-x', `${startX}px`);
    flyItem.style.setProperty('--start-y', `${startY}px`);
    flyItem.style.setProperty('--end-x', `${endX}px`);
    flyItem.style.setProperty('--end-y', `${endY}px`);
    
    // Use product image as background if available
    if (this.product?.imageUrl) {
      flyItem.style.backgroundImage = `url(${this.product.imageUrl})`;
    }

    document.body.appendChild(flyItem);

    setTimeout(() => {
      flyItem.remove();
      if (type === 'cart') {
        this.addToCartAnimation = false;
      } else {
        this.wishlistAnimation = false;
      }
    }, 1000);
  }

  addToCart(event: MouseEvent) {
    this.handleClick(event, 'cart');
    const cartItem = {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      rentalPeriod: this.selectedRentalPeriod,
      quantity: this.quantity
    };
    console.log('Added to cart:', cartItem);
  }

  toggleWishlist(event: MouseEvent) {
    this.handleClick(event, 'wishlist');
  }

  increaseQuantity() {
    if (this.quantity < (this.product?.stock || 10)) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  changeImage(newImage: string) {
    if (this.product) {
      const currentMain = this.product.imageUrl;
      this.product.imageUrl = newImage;
      const index = this.product.additionalImages.indexOf(newImage);
      if (index !== -1) {
        this.product.additionalImages[index] = currentMain;
      }
    }
  }

  openPaymentModal() {
    this.showPaymentModal = true;
    this.generateOrderNumber();
  }

  closePaymentModal() {
    this.showPaymentModal = false;
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

  printPaymentInstructions() {
    window.print();
  }

  confirmPayment() {
    this.closePaymentModal();
    alert(`Order ${this.orderNumber} has been confirmed. Please proceed with payment to the supplier.`);
  }
}