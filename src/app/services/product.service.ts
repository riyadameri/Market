// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {



  private apiUrl = `${environment.apiUrl}/product`; // Use environment variable for base URL

  constructor(private http: HttpClient) {}


  addProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, formData);
  }
  

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/list`); // Adjusted endpoint for clarity
  }

  getProductById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/get/${id}`);
  }

  // create Order
  createOrder(orderData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/order/add`, orderData);
  }

  // get Order
  getUserOrder(clientId:string): Observable<any> {
    return this.http.get(`${this.apiUrl}/order/myorders/${clientId}`);
  }

  
  getProductbyUserId(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/user/${userId}`);
  
  }

  //get orders of seller

getSupplierOrders(supplierId: string): Observable<any> {
  return this.http.get(`${this.apiUrl}/orders/supplier/${supplierId}`);
}


//get orderDetails  productDetails buyerDetails sellerDetails
AllOrderData(id: string){
  return this.http.get(`${this.apiUrl}/AllOrderData/${id}`)
}

// In your product.service.ts
updateOrderStatus(orderId: string, status: string) {
  return this.http.patch(`${this.apiUrl}/orders/${orderId}`, { status });
}
deleteProduct(id:string){
  return this.http.delete(`${this.apiUrl}/product/remove/${id}`)
}
// Add this method to your ProductService class
changeOrderStatus(orderId: string, status: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/order/confirm/${orderId}`, { status });
}


removeOrder(orderId: string): Observable<any> {
  return this.http.delete(`${this.apiUrl}/order/remove/${orderId}`);
 }

}
