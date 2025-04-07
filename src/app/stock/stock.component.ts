import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger('100ms', [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('300ms ease-in-out', style({ transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ transform: 'translateX(100%)' }))
      ])
    ])
  ]
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
  isLoading = true;
  defaultProfileImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';
  setCurrentTab(tab: string) {
    if (this.currentTab !== tab) {
      this.currentTab = tab;
      this.loadDataForCurrentTab();
    }
  }
  
  loadDataForCurrentTab() {
    if (this.currentTab === 'inventory') {
      this.loadProducts();
    } else if (this.currentTab === 'orders') {
      this.loadOrders();
    }
    // Add other tabs if needed
  }
  
  wilayas = [
    "Tougourt","Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Béjaïa", "Biskra",
    "Béchar", "Blida", "Bouira", "Tamanrasset", "Tébessa", "Tlemcen", "Tiaret",
    "Tizi Ouzou", "Algiers", "Djelfa", "Jijel", "Sétif", "Saïda", "Skikda",
    "Sidi Bel Abbès", "Annaba", "Guelma", "Constantine", "Médéa", "Mostaganem",
    "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", "Bordj Bou Arréridj",
    "Boumerdès", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", "Khenchela",
    "Souk Ahras", "Tipaza", "Mila", "Aïn Defla", "Naâma", "Aïn Témouchent",
    "Ghardaïa", "Relizane"
  ];

  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userId = JSON.parse(localStorage.getItem('user') || '{}')._id;
    this.loadProducts();
    this.loadOrders();
    this.loadDataForCurrentTab(); // Load initial data
  
  }

  windowReload() {
    window.location.reload();
  }

  loadProducts() {
    this.isLoading = true;
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.isLoading = false;
      }
    });
  }

  loadOrders() {
    this.isLoading = true;
    this.productService.getSupplierOrders(this.userId).subscribe({
      next: (orders) => {
        const sortedOrders = orders.sort((a: any, b: any) => {
          return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        });
  
        this.orders = sortedOrders.map((order: any) => {
          const orderObj: any = {
            _id: order._id,
            orderNumber: order.orderNumber,
            productId: order.productId,
            productName: 'Loading...',
            quantity: order.quantity,
            customer: order.userPhone,
            orderDate: new Date(order.orderDate).toLocaleDateString(),
            status: order.status,
            totalPrice: order.totalPrice,
            size: order.size,
            _orderDate: new Date(order.orderDate)
          };
  
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
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
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
    return 'status-' + status.toLowerCase().replace(' ', '-');
  }

  getInventoryValue(): number {

    // load the page fist

    this.router.navigate(['/stock']);

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

  getUserData(id: string) {
    return this.userService.getUserDataById(id);
  }

  getProductData(id: string) {
    return this.productService.getProductById(id);
  }

  updateOrderStatus(id: string, status: string) {
    this.productService.updateOrderStatus(id, status).subscribe({
      next: () => {
        const order = this.orders.find(o => o._id === id);
        if (order) {
          order.status = status;
        }
      },
      error: (err) => {
        console.error('Error updating order status:', err);
      }
    });
  }

  removeOrder(event: Event, id: string) {
    event.stopPropagation(); // Prevent row click event
    if (confirm('Are you sure you want to remove this order?')) {
      this.productService.removeOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(order => order._id !== id);
        },
        error: (err) => {
          console.error('Error removing order:', err);
        }
      });
    }
  }
}