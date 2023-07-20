import { Component } from '@angular/core';
import { AuthenticationServiceService } from '../authentication-service.service';
@Component({
  selector: 'app-shared-logout-button-component',
  templateUrl: './shared-logout-button-component.component.html',
  styleUrls: ['./shared-logout-button-component.component.css']
})
export class SharedLogoutButtonComponentComponent {
  constructor(private authService: AuthenticationServiceService) {}

  // Trigger the logout function when the user clicks on the logout button
  logout() {
    this.authService.logout();
  }
}
