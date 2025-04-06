import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';
import { ProductService } from '../services/product.service';

interface OrderItem {
  productId: string;
  name?: string;
  imageUrl?: string;
  rentalPrice?: number;
  rentalPeriod?: string;
  size?: string;
  color?: string;
  quantity: number;
  productDetails?: any; // Add this for storing fetched product details
}

interface Order {
  _id: string;
  orderNumber: string;
  orderDate: Date;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  totalPrice: number;
  Tax: number;
  deliveryAddress?: string;
  paymentMethod?: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, HeaderComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = [];
  userData: any = JSON.parse(localStorage.getItem('user') || '{}');
  defaultProfileImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';
  isLoading = true;

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.isLoading = true;
    this.productService.getUserOrder(this.userData._id).subscribe(
      async (response: any[]) => {
        this.orders = await this.enrichOrdersWithProductDetails(response);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching orders:', error);
        this.isLoading = false;
      }
    );
  }

  async enrichOrdersWithProductDetails(orders: any[]): Promise<Order[]> {
    const enrichedOrders = [];
    
    for (const order of orders) {
      const enrichedOrder: Order = {
        ...order,
        orderDate: new Date(order.orderDate),
        items: []
      };

      // Fetch product details for each item
      const productDetails = await this.getProductById(order.productId);
      
      enrichedOrder.items.push({
        productId: order.productId,
        quantity: order.quantity,
        size: order.size,
        productDetails: productDetails,
        name: productDetails?.name,
        rentalPrice: productDetails?.price,
        imageUrl: this.getProductImage(productDetails)
      });

      enrichedOrders.push(enrichedOrder);
    }

    return enrichedOrders;
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Confirmed':
        return 'status-confirmed';
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      case 'Cancelled':
        return 'status-cancelled';
      case 'Returned':
        return 'status-returned';
      case 'Pending':
        return 'status-pending';
      default:
        return '';
    }
  }

  getDeliveryText(order: Order): string {
    if (order.status === 'Delivered' && order.actualDelivery) {
      return `Delivered on ${new Date(order.actualDelivery).toLocaleDateString()}`;
    } else if (order.estimatedDelivery) {
      return `Estimated delivery: ${new Date(order.estimatedDelivery).toLocaleDateString()}`;
    }
    return '';
  }

  trackByOrderId(index: number, order: Order): string {
    return order._id;
  }

  getProductImage(product: any): string {
    if (product?.image) {
      if (product.image.startsWith('http')) {
        return product.image;
      }
      return `http://localhost:3000/uploads/${product.image.split('/').pop()}`;
    }
    return this.defaultProfileImage;
  }

  private async getProductById(id: string): Promise<any> {
    try {
      const product = await this.productService.getProductById(id).toPromise();
      return product || {};
    } catch (error) {
      console.error('Error fetching product details:', error);
      return {};
    }
  }

  
}