import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ivalidCred:any
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    const { email, password } = this.loginForm.value;
    this.authService.login({ email, password }).subscribe(
      (response: any) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/home']);
      },
      (error) =>{
        if(error.error.msg){
          this.ivalidCred = error.error.msg
        }
        console.error("err::...",error.error.msg)
      }
    );
  }
}
