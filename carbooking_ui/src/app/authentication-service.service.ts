import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  constructor(private router: Router) {}

  // Logout function to clear user-related data
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // You may also perform other cleanup tasks if needed
    this.router.navigate(['/userLogin']); // Navigate to the login page after logout
  }
}