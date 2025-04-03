import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from "../footer/footer.component";
import { RouterOutlet } from '@angular/router';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-supplier',
  imports: [HeaderComponent, FooterComponent,RouterOutlet],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css'
})
export class SupplierComponent {

}
