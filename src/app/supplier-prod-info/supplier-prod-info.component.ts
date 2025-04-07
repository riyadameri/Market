import { Component } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-supplier-prod-info',
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './supplier-prod-info.component.html',
  styleUrl: './supplier-prod-info.component.css'
})
export class SupplierProdInfoComponent {
  constructor(
  private ProductService : ProductService,
  private route: ActivatedRoute,
  private router : Router
){}

  product : any = [];
  productId = '';
  showConfirmDialog = false;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['id'];
      console.log('Product ID:', this.productId);
      this.ProductService.getProductById(this.productId ? this.productId.toString() : '').subscribe((data) => {
        this.product = data;
        console.log(this.product);
      }
      );

    });
  }
  openConfirmDialog() {
    this.showConfirmDialog = true;
  }

  closeConfirmDialog() {
    this.showConfirmDialog = false;
  }

  confirmRemove() {
    this.ProductService.deleteProduct(this.productId).subscribe(
      (res)=>{
        console.log(res)
      }
    )
    this.closeConfirmDialog();
    // route to supplier

    this.router.navigate(['/supplier']);
    

    

  }

}
