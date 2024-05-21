import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-userprofile',
  templateUrl: './userprofile.component.html',
  styleUrl: './userprofile.component.css'
})
export class UserprofileComponent {

  constructor(private userProfile:  AuthService,
    private router: Router) {}

  profileData = {
    email: '',
    name: '',
    password: '',
    city: '',
  };
  profilePicture:any
  currentUser:any
  imageSrc:any;

  ngOnInit(): void {
    this.currentUser = localStorage.getItem('token');
    this.getCurrentUser();
  }


  getCurrentUser(){
    this.userProfile.currentUser(this.currentUser)
    .subscribe(
      (response:any) => {

        const parts = response.profilePicture.split('\\');
        const fileName = parts[parts.length - 1];
        this.imageSrc = 'http://localhost:5000/Uploads/' + fileName;
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }

  handleFileInput(event: any) {
    this.profilePicture = event.target.files[0];
  }

  updateProfile() {
    const formData = new FormData();
    formData.append('email', this.profileData.email);
    formData.append('name', this.profileData.name);
    formData.append('password', this.profileData.password);
    formData.append('city', this.profileData.city);
    formData.append('profilePicture', this.profilePicture);
    this.userProfile.updateProfile(formData)
    .subscribe(
      (response:any) => {
          this.getCurrentUser();
      },
      (error) => {
        console.error('Error updating profile:', error);
      }
    );
  }
}
