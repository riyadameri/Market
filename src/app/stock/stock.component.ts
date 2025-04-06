import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
// Removed unused import
import { UserService } from '../services/user.service';
// Removed unused import
@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],

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

  inventory: any[] = [];
  orders: any[] = [];
  userId: string = '';
  isLoading = true ;

  constructor(
    private productService: ProductService,
    private UserService : UserService,
    private router: Router

  ) {}
  defaultProfileImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    this.loadProducts();
    this.loadOrders();
  }

  loadProducts() {
    this.productService.getProductbyUserId(this.userId).subscribe({
      next: (products) => {
        this.inventory = products.map((product: any) => ({
          id: product._id,
          name: product.name,
          category: product.category,
          sku: product._id.substring(0, 8).toUpperCase(),
          currentStock: product.stock,
          reserved: 0,
          available: product.stock,
          price: product.price,
          cost: product.originalPrice * 0.6,
          status: this.getStockStatus(product.stock),
          image: product.image,
        }));
        this.calculateStockCounts();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  loadOrders() {
    this.productService.getSupplierOrders(this.userId).subscribe({
      next: (orders) => {
        this.orders = orders.map((order: any) => {
          // Create basic order object
          const orderObj: any = {
            _id: order._id,
            orderNumber: order.orderNumber,
            productId: order.productId, // This is just the ID string
            productName: 'Loading...', // Temporary placeholder
            quantity: order.quantity,
            customer: order.userPhone,
            orderDate: new Date(order.orderDate).toLocaleDateString(),
            status: order.status,
            totalPrice: order.totalPrice,
            size: order.size
          };
  
          // Fetch product details for each order
          if (order.productId) {
            this.productService.getProductById(order.productId).subscribe({
              next: (product) => {
                orderObj.productName = product?.name || 'Unknown Product';
              },
              error: () => {
                orderObj.productName = 'Unknown Product';
              }
            });
          }
  
          return orderObj;
        });
      },
      error: (err) => {
        console.error('Error loading orders:', err);
      }
    });
  }
  // Helper method to fetch product details
  async fetchProductDetails(productId: string): Promise<string> {
    try {
      const product = await this.productService.getProductById(productId).toPromise();
      return product?.name || 'Unknown Product';
    } catch (error) {
      console.error('Error fetching product details:', error);
      return 'Unknown Product';
    }
  }

  getStockStatus(stock: number): string {
    if (stock > 10) return 'In Stock';
    if (stock > 0) return 'Low Stock';
    return 'Out of Stock';
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
      case 'delivered': return 'status-delivered';
      default: return 'status-cancelled';
    }
  }

  getInventoryValue(): number {
    return this.inventory.reduce((total, item) => total + (item.currentStock * item.cost), 0);
  }

  handleImageError(event: Event) {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.defaultProfileImage;
  }

  getProductImage(product: any): string {
    if (!product || !product.image) {
      return this.defaultProfileImage;
    }
    
    if (product.image.startsWith('http')) {
      return product.image;
    }
    
    const imagePath = product.image.split('/').pop();
    return `http://localhost:3000/uploads/${imagePath}`;
  }


  getUserData(id:string){
    return this.UserService.getUserDataById(id)
  }

  getProductData(id:string){
    return this.productService.getProductById(id)
  }

  updateOrderStatus(id: string, ac : string){

  }

  

}