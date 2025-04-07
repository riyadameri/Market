import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-order',
  templateUrl: './supplier-order.component.html',
  styleUrls: ['./supplier-order.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SupplierOrderComponent implements OnInit {
  orderId: string = '';
  orderData: any = null;
  isLoading: boolean = true;
  error: string | null = null;
  defaultProductImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';
  defaultProfileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.params['id'];
    this.loadOrderData();
  }

  loadOrderData(): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.AllOrderData(this.orderId).subscribe({
      next: (data) => {
        this.orderData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order details. Please try again later.';
        this.isLoading = false;
        console.error('Error loading order data:', err);
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'pending': return 'pending';
      case 'confirmed': return 'confirmed';
      case 'shipped': return 'shipped';
      case 'delivered': return 'delivered';
      case 'completed': return 'completed';
      case 'cancelled': return 'cancelled';
      case 'rejected': return 'cancelled';
      case 'returned': return 'returned';
      default: return 'pending';
    }
  }

  getProductImage(product: any): string {
    if (!product || !product.image) {
      return this.defaultProductImage;
    }
    
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    return `http://127.0.0.1:3000/uploads/${product.image.split('/').pop()}`;
  }

  getProfileImage(user: any): string {
    if (!user || !user.profileImage) {
      return this.defaultProfileImage;
    }
    
    if (user.profileImage.startsWith('http')) {
      return user.profileImage;
    }
    
    return `http://127.0.0.1:3000/${user.profileImage}`;
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultProductImage;
  }

  handleProfileImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultProfileImage;
  }

  confirmOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Confirmed').subscribe({
      next: () => {
        this.updateStatus('Confirmed');
      },
      error: (err) => {
        console.error('Error confirming order:', err);
        alert('Failed to confirm order. Please try again.');
      }
    });
  }

  rejectOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Cancelled').subscribe({
      next: () => {
        this.updateStatus('Cancelled');
      },
      error: (err) => {
        console.error('Error rejecting order:', err);
        alert('Failed to reject order. Please try again.');
      }
    });
  }

  ShippedOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Shipped').subscribe({
      next: () => {
        this.updateStatus('Shipped');
      },
      error: (err) => {
        console.error('Error shipping order:', err);
        alert('Failed to ship order. Please try again.');
      }
    });
  }

  DeliveredOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Delivered').subscribe({
      next: () => {
        this.updateStatus('Delivered');
      },
      error: (err) => {
        console.error('Error delivering order:', err);
        alert('Failed to deliver order. Please try again.');
      }
    });
  }

  completeOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Completed').subscribe({
      next: () => {
        this.updateStatus('Completed');
      },
      error: (err) => {
        console.error('Error completing order:', err);
        alert('Failed to complete order. Please try again.');
      }
    });
  }

  ReturnedOrder(): void {
    if (!this.orderData) return;

    this.productService.changeOrderStatus(this.orderId, 'Returned').subscribe({
      next: () => {
        this.updateStatus('Returned');
      },
      error: (err) => {
        console.error('Error marking order as returned:', err);
        alert('Failed to mark order as returned. Please try again.');
      }
    });
  }

  private updateStatus(newStatus: string): void {
    this.orderData.orderDetails.currentStatus = newStatus;
    this.orderData.orderDetails.statusHistory.push({
      status: newStatus,
      date: new Date().toISOString()
    });
  }



}