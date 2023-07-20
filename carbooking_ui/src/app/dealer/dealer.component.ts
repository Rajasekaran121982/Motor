import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../environments/environment';


@Component({
  selector: 'app-dealer',
  templateUrl: './dealer.component.html',
  styleUrls: ['./dealer.component.css']
})
export class DealerComponent {
  title = 'carbookingsystem';
  dealerLogin: FormGroup;
  submitted = false; 
  formData: any;
   body: any;
   private router: Router;
  
  
   
  
  constructor(private formBuilder: FormBuilder,  private http: HttpClient) {}
  ngOnInit() {
      this.dealerLogin = this.formBuilder.group({
        adminID: [null, [Validators.required]],
        password: [null, Validators.required]
      });
      
  }

  isFieldInvalid(field: string) {
    return !this.dealerLogin.get(field).valid && this.dealerLogin.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.dealerLogin.get(field).valid && this.dealerLogin.get(field).touched;
  }

  onSubmit() {

    this.validateAllFormFields(this.dealerLogin);
    if (this.dealerLogin.valid) {
      this.formData = this.dealerLogin.value;

         this.body = {
                    formData: this.formData
        };
        // Handle saving form data
        // this.myHttpService.login(this.formData).subscribe(response => {
        //
        // });
        const url = `${environment.apiUrl}/dealer`;
        
        this.http.post(url, this.formData,{ responseType: 'json' }).subscribe(
        
        (response: any) => {
            // Handle the response here
            const routeId = response.routeid;
            // this.router.navigate(['/adminDashboard']);
            window.location.href = 'http://localhost:4200/dealerDashboard';
            console.log(routeId);
          },
          error => {
            // Handle any errors here test
            console.log(this.body);
            console.error(error);
          }
        );


      
  }
}


validateAllFormFields(formGroup: FormGroup) {
  Object.keys(formGroup.controls).forEach(field => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      this.validateAllFormFields(control);
    }
  });
}
  
    }
    