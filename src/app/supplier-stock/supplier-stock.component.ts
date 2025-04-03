import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-supplier-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './supplier-stock.component.html',
  styleUrls: ['./supplier-stock.component.css']
})
export class SupplierStockComponent {
  currentTab: string = 'inventory';
  searchQuery: string = '';
  sortField: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  inStockCount = 52  ;
  lowStockCount = 103
  outOfStockCount = 205
  inventory = [
    {
      id: 1,
      name: 'Premium Leather Jacket',
      category: 'Outerwear',
      sku: 'PLJ-001',
      currentStock: 15,
      reserved: 3,
      available: 12,
      price: 89.99,
      cost: 45.00,
      lastUpdated: '2023-05-15',
      status: 'In Stock'
    },
    {
      id: 2,
      name: 'Vintage Leather Boots',
      category: 'Footwear',
      sku: 'VLB-002',
      currentStock: 10,
      reserved: 2,
      available: 8,
      price: 129.99,
      cost: 65.00,
      lastUpdated: '2023-05-18',
      status: 'Low Stock'
    },
    {
      id: 3,
      name: 'Designer Handbag',
      category: 'Accessories',
      sku: 'DHB-003',
      currentStock: 5,
      reserved: 1,
      available: 4,
      price: 199.99,
      cost: 90.00,
      lastUpdated: '2023-05-20',
      status: 'Low Stock'
    },
    {
      id: 4,
      name: 'Casual Sneakers',
      category: 'Footwear',
      sku: 'CSN-004',
      currentStock: 25,
      reserved: 5,
      available: 20,
      price: 59.99,
      cost: 30.00,
      lastUpdated: '2023-05-10',
      status: 'In Stock'
    },
    {
      id: 5,
      name: 'Formal Watch',
      category: 'Accessories',
      sku: 'FW-005',
      currentStock: 10,
      reserved: 2,
      available: 8,
      price: 199.99,
      cost: 95.00,
      lastUpdated: '2023-05-22',
      status: 'In Stock'
    },
    {
      id: 6,
      name: 'Wool Scarf',
      category: 'Accessories',
      sku: 'WS-006',
      currentStock: 40,
      reserved: 8,
      available: 32,
      price: 24.99,
      cost: 12.00,
      lastUpdated: '2023-05-05',
      status: 'In Stock'
    },
    {
      id: 7,
      name: 'Leather Backpack',
      category: 'Accessories',
      sku: 'LB-007',
      currentStock: 15,
      reserved: 3,
      available: 12,
      price: 149.99,
      cost: 70.00,
      lastUpdated: '2023-05-17',
      status: 'In Stock'
    },
    {
      id: 8,
      name: 'Silk Tie',
      category: 'Accessories',
      sku: 'ST-008',
      currentStock: 20,
      reserved: 4,
      available: 16,
      price: 29.99,
      cost: 15.00,
      lastUpdated: '2023-05-12',
      status: 'In Stock'
    }
  ];

  orders = [
    {
      id: 1001,
      productName: 'Premium Leather Jacket',
      quantity: 5,
      customer: 'Fashion Store Inc.',
      orderDate: '2023-05-20',
      deliveryDate: '2023-05-27',
      status: 'Processing'
    },
    {
      id: 1002,
      productName: 'Vintage Leather Boots',
      quantity: 3,
      customer: 'Shoe Palace',
      orderDate: '2023-05-18',
      deliveryDate: '2023-05-25',
      status: 'Shipped'
    },
    {
      id: 1003,
      productName: 'Designer Handbag',
      quantity: 2,
      customer: 'Luxury Boutique',
      orderDate: '2023-05-22',
      deliveryDate: '2023-05-29',
      status: 'Pending'
    }
  ];

  get filteredInventory() {
    let items = [...this.inventory];
    
    // Filter by search query
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
    // Sort items
    items.sort((a, b) => {
      const fieldA = a[this.sortField as keyof typeof a];
      const fieldB = b[this.sortField as keyof typeof b];
      
      if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    return items;
  }

  changeSort(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'in stock': return 'status-in-stock';
      case 'low stock': return 'status-low-stock';
      case 'out of stock': return 'status-out-of-stock';
      default: return 'status-pending';
    }
  }

  getOrderStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'shipped': return 'status-shipped';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      default: return 'status-cancelled';
    }
  }

  getInventoryValue(): number {
    return this.inventory.reduce((total, item) => total + (item.currentStock * item.cost), 0);
  }
}