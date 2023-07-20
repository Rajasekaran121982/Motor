import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdminComponent } from './admin/admin.component';
import { RecaptchaV3Module, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { UserComponent } from './user/user.component';
import {  ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule }    from '@angular/common/http';
import { UserLoginComponent } from './user-login/user-login.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { Router, RouterModule } from '@angular/router';
import { FileUploadService } from './service/file-upload.service';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { SharedLogoutButtonComponentComponent } from './shared-logout-button-component/shared-logout-button-component.component';
import { DealerComponent } from './dealer/dealer.component';
import { DealrDashboardComponent } from './dealr-dashboard/dealr-dashboard.component';
import { CustomerBookingService} from './service/customer-booking.service';
import { MatTableModule } from '@angular/material/table'; // Make sure MatTableModule is imported
import { MatSortModule } from '@angular/material/sort'; 
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ScrollingModule } from '@angular/cdk/scrolling'; 






@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    UserComponent,
    UserLoginComponent,
    AdmindashboardComponent,
    UserdashboardComponent,
    SharedLogoutButtonComponentComponent,
    DealerComponent,
    DealrDashboardComponent,
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatExpansionModule,
    MatTooltipModule,
    RecaptchaV3Module,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatTableModule,
    MatSortModule,
    MatSnackBarModule,
    ScrollingModule,
    
  ],
  exports: [RouterModule],
  providers: [{
    provide: RECAPTCHA_V3_SITE_KEY,
    useValue: environment.recaptcha.siteKey,
    
},
{
  provide: FileUploadService,
      useClass: FileUploadService
},
{ provide: CustomerBookingService,
      useClass: CustomerBookingService
}


],
  bootstrap: [AppComponent]
})
export class AppModule { }
