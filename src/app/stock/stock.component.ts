import { Component , OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-stock',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.css'
})


export class SupplierStockComponent implements OnInit {
  currentTab: string = 'inventory';
  searchQuery: string = '';
  sortField: string = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Stock counts
  inStockCount: number = 0;
  lowStockCount: number = 0;
  outOfStockCount: number = 0;

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

  ngOnInit() {
    this.calculateStockCounts();
  }

  calculateStockCounts() {
    this.inStockCount = this.inventory.filter(item => item.status === 'In Stock').length;
    this.lowStockCount = this.inventory.filter(item => item.status === 'Low Stock').length;
    this.outOfStockCount = this.inventory.filter(item => item.status === 'Out of Stock').length;
  }

  get filteredInventory() {
    let items = [...this.inventory];
    
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.sku.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }
    
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