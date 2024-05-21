// src/app/components/signup/signup.component.ts
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  email: string = '';
  password: string = '';
  Address:string ='';
  name:string='';
  constructor(private authService: AuthService, private router: Router) {}

  signup() {
    this.authService.signup({ email: this.email, password: this.password, Address: this.Address,name:this.name }).subscribe(
      () => this.router.navigate(['/login']),
      (error) => console.error(error)
    );
  }
}
