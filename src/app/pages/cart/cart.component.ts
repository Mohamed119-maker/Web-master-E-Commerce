import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  constructor(){
    
  }
   private  toaster = inject(ToastrService);
   private  router = inject(Router);
  private readonly productsService = inject(CartService);
CheckAuthUser(){
  const token = localStorage.getItem('userToken')
  console.log('token is :',token)
  if(!token){
  this.router.navigate(['/login'])
  } else{
    this.GetUserCart()
  }
}
  ngOnInit(): void {
  this.CheckAuthUser()
  }
  GetUserCart():void{
    this.productsService.getUserCart().subscribe({
      next:(res) =>{console.log('RES is ',res)},
      error:(err)=> {this.toaster.error( 'error is', err.error.message)},
    })
  }
// 

}
