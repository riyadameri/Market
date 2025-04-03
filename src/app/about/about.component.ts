import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [HeaderComponent,FormsModule,CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  companyName = "تأجير الأزياء الجزائرية";
  slogan = "جمالك في أسلوبنا - تأجير الأزياء بلمسة جزائرية";
  foundingYear = 2015;
  teamSize = 30;
  locations = ["وهرن","الجزائر العاصمة", "ورقلة", "تماسين", "تقرت"];
}
