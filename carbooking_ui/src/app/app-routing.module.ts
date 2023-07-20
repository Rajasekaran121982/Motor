import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { AdmindashboardComponent } from './admindashboard/admindashboard.component';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import { DealerComponent } from './dealer/dealer.component';
import { DealrDashboardComponent } from './dealr-dashboard/dealr-dashboard.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
{ path: 'home', component: HomeComponent },
{ path: 'admin', component: AdminComponent },
{ path: 'user', component: UserComponent },
{ path: 'dealer', component: DealerComponent },
{ path: 'userLogin', component: UserLoginComponent },
{ path: 'adminDashboard', component: AdmindashboardComponent },
{ path: 'userDashboard', component: UserdashboardComponent },
{ path: 'dealerDashboard', component: DealrDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
