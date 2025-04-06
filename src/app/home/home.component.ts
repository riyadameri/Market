import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { AdvertisemenDisplayBarComponent } from "../advertisemen-display-bar/advertisemen-display-bar.component";
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserfooterComponent } from '../userfooter/userfooter.component';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent, 
    AdvertisemenDisplayBarComponent, 
    CommonModule,
    RouterModule,
    UserfooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  constructor(private ProductService : ProductService) { }
  ctId: string | null = null;


  defaultProfileImage = 'https://cdn.pixabay.com/photo/2012/04/15/19/13/box-34980_640.png';

  products : any = [];

  ngOnInit(): void {
    this.ProductService.getProducts().subscribe((data) => {
      this.products = data;
    });
    
  }
  ads = [
    {
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Summer Collection',
      description: 'New arrivals for the sunny season',
      link: '/summer-collection'
    },
    {
      image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Designer Sale',
      description: 'Up to 40% off premium brands',
      link: '/designer-sale'
    },
    {
      image: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Weekend Special',
      description: 'Limited time offers just for you',
      link: '/weekend-special'
    },
    {
      image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Accessories',
      description: 'Complete your look',
      link: '/accessories'
    },
    {
      image: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Luxury Watches',
      description: 'Timeless elegance',
      link: '/watches'
    },
    {
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Shoes & Boots',
      description: 'Step out in style',
      link: '/footwear'
    },
    {
      image: 'https://images.unsplash.com/photo-1595341595379-cf0f2f1a457b?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Formal Wear',
      description: 'Perfect for special occasions',
      link: '/formal-wear'
    },
    {
      image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80',
      title: 'Casual Outfits',
      description: 'Comfort meets style',
      link: '/casual'
    }
  ];


  getDiscountedPrice(originalPrice: number, discount: number): number {
    return originalPrice - (originalPrice * discount / 100);
  }
  addToCart(product: any) {
    console.log('Product added to cart:', product);
  }
  scrollAds(index: number) {
    const adContainer = document.querySelector('.ad-container') as HTMLElement;
    const firstAd = adContainer.firstElementChild as HTMLElement;
    adContainer.appendChild(firstAd);
  }
  navigateToAd(link: string) {
    console.log('Navigating to:', link);
    // Implement navigation logic here, e.g., using Angular Router
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


  getBrandLogo(product: any) :string{
    if (product?.brandLogo) {
      if (product.brandLogo.startsWith('http')) {
        return product.brandLogo;
      }
      return `http://localhost:3000/uploads/${product.brandLogo}`;
    }
    return this.defaultProfileImage;
  }

  
  
}