import { Routes , RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AddProductComponent } from './product-form/product-form.component';
import { GetProductComponent } from './get-product/get-product.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { AboutComponent } from './about/about.component';
import { CartComponent } from './cart/cart.component';
import { FavoritesComponent } from './favorites/favorites.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { OrdersComponent } from './orders/orders.component';
import { SettingsComponent } from './settings/settings.component';
import { SupplierComponent } from './supplier/supplier.component';
import { NgModule } from '@angular/core';
import { SupplierStockComponent } from './stock/stock.component';


export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'about', component: AboutComponent },
    { path: 'cart', component: CartComponent },
    { path: 'favorites', component: FavoritesComponent },
    { path: 'contact-us', component: ContactUsComponent },
    { path: 'add-product', component: AddProductComponent },
    { path: 'orders',component:OrdersComponent},   
    { path: 'settings', component: SettingsComponent },
    { path: 'product/:id', component: GetProductComponent },

    { 
        path : 'supplier',
        component : SupplierComponent,
        children : [
            {path : 'cart',component :CartComponent},
            {path: 'add-product',component:AddProductComponent},
            {path : 'stock',component:SupplierStockComponent},
            {path: '',component:SupplierStockComponent},
            {path:'orders/:id',component:OrdersComponent}
        ]
    },



   // { path: '**', redirectTo: '/home' } // Handle 404
];