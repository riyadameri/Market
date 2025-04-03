import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from "../header/header.component";
import { AdvertisementDisplayBarComponent } from "../advertisement-display-bar/advertisement-display-bar.component";
import { NewsletterSignupComponent } from "../newsletter-signup/newsletter-signup.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    AdvertisementDisplayBarComponent,
    NewsletterSignupComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  featuredProducts = [
    // ... (your existing product array)
  ];

  categories = [
    {
      id: 1,
      name: 'Men\'s Fashion',
      slug: 'mens-fashion',
      imageUrl: 'https://example.com/images/mens-category.jpg'
    },
    {
      id: 2,
      name: 'Women\'s Fashion',
      slug: 'womens-fashion',
      imageUrl: 'https://example.com/images/womens-category.jpg'
    },
    {
      id: 3,
      name: 'Accessories',
      slug: 'accessories',
      imageUrl: 'https://example.com/images/accessories-category.jpg'
    },
    {
      id: 4,
      name: 'Footwear',
      slug: 'footwear',
      imageUrl: 'https://example.com/images/footwear-category.jpg'
    }
  ];

  getColorCode(colorName: string): string {
    const colorMap: {[key: string]: string} = {
      'Black': '#000000',
      'Brown': '#964B00',
      'Tan': '#D2B48C',
      'Silver': '#C0C0C0',
      'Blue': '#0000FF',
      'White': '#FFFFFF',
      'Gray': '#808080',
      'Navy': '#000080'
    };
    return colorMap[colorName] || '#CCCCCC';
  }
}