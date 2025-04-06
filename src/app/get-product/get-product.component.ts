import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
@Component({
  selector: 'app-get-product',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule,HeaderComponent],
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.css']
})
export class GetProductComponent {
  userData: any = JSON.parse(localStorage.getItem('user') || '{}');

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

  defaultProfileImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';

  constructor(    
    private route: ActivatedRoute,
    private ProductService :ProductService

    ) {

  }

  prod : any = []

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      console.log('Product ID:', this.productId);
      this.ProductService.getProductById(this.productId ? this.productId.toString() : '').subscribe((data) => {
        this.prod = data;
        console.log(this.prod);
      }
      );

    });
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
    this.ProductService.createOrder({
      userId : this.userData._id,
      sellerId : this.prod.userId,
      productId : this.prod._id,
      totalPrice : this.prod.price ,
      userPhone : this.userData.phone,
      orderNumber: this.orderNumber,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity

    }).subscribe(response => {
      console.log('Order created:', response);
    }, error => {
      console.error('Error creating order:', error);
    });

  }

  getProductImage(product: any) {
    if (product?.image) {
      // Check if it's already a full URL (might be from social login)
      if (product.image.startsWith('http')) {
        return product.image;
      }
      // Otherwise, construct the URL to your backend
      return `http://localhost:3000/uploads/${product.image.split('/').pop()}`;
    }
    return this.defaultProfileImage;
  }

  
  

}