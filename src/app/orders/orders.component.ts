import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../header/header.component';

interface OrderItem {
  productId: number;
  name: string;
  imageUrl: string;
  rentalPrice: number;
  rentalPeriod: string;
  size?: string;
  color?: string;
}

interface Order {
  orderId: string;
  orderDate: Date;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  deliveryAddress: string;
  paymentMethod: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule,FormsModule,HeaderComponent,],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent {
  orders: Order[] = [
    {
      orderId: 'ORD-2023-45678',
      orderDate: new Date('2023-05-15'),
      status: 'Delivered',
      items: [
        {
          productId: 1,
          name: 'Premium Leather Jacket',
          imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
          rentalPrice: 29.99,
          rentalPeriod: '1 week',
          size: 'M',
          color: 'Black'
        },
        {
          productId: 15,
          name: 'Designer Handbag',
          imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
          rentalPrice: 59.99,
          rentalPeriod: '2 weeks',
          color: 'Black'
        }
      ],
      subtotal: 89.98,
      shippingFee: 9.99,
      tax: 7.99,
      total: 107.96,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      paymentMethod: 'Visa ending in 4242',
      estimatedDelivery: new Date('2023-05-18'),
      actualDelivery: new Date('2023-05-17')
    },
    {
      orderId: 'ORD-2023-35621',
      orderDate: new Date('2023-04-28'),
      status: 'Returned',
      items: [
        {
          productId: 22,
          name: 'Formal Watch',
          imageUrl: 'https://i.pinimg.com/736x/c7/c8/5c/c7c85c4fb54186485cacf5b72d95009b.jpg',
          rentalPrice: 59.99,
          rentalPeriod: '1 week',
          color: 'Silver'
        }
      ],
      subtotal: 59.99,
      shippingFee: 4.99,
      tax: 5.20,
      total: 70.18,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      paymentMethod: 'Visa ending in 4242',
      estimatedDelivery: new Date('2023-05-01'),
      actualDelivery: new Date('2023-05-02')
    },
    {
      orderId: 'ORD-2023-28945',
      orderDate: new Date('2023-06-10'),
      status: 'Shipped',
      items: [
        {
          productId: 24,
          name: 'Leather Backpack',
          imageUrl: 'https://i.pinimg.com/736x/18/41/88/1841882091b80ce14746f504d7298d30.jpg',
          rentalPrice: 49.99,
          rentalPeriod: '2 weeks',
          color: 'Brown'
        }
      ],
      subtotal: 49.99,
      shippingFee: 4.99,
      tax: 4.40,
      total: 59.38,
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      paymentMethod: 'Visa ending in 4242',
      estimatedDelivery: new Date('2023-06-15')
    }
  ];

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
      default:
        return '';
    }
  }
  getDeliveryText(order: Order): string {
    if (order.status === 'Delivered' && order.actualDelivery) {
      return `Delivered on ${order.actualDelivery.toLocaleDateString()}`;
    } else if (order.estimatedDelivery) {
      return `Estimated delivery: ${order.estimatedDelivery.toLocaleDateString()}`;
    }
    return '';
  }
  

  trackByOrderId(index: number, order: Order): string {
    return order.orderId;
  }
}