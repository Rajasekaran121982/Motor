import { Component, OnInit, Injector } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

export class AdminComponent   implements OnInit {
  title = 'carbookingsystem';
  adminLogin: FormGroup;
  submitted = false; 
  formData: any;
   body: any;
   private router: Router;
  
  
   
  
  constructor(private formBuilder: FormBuilder,  private http: HttpClient) {}
  ngOnInit() {
      this.adminLogin = this.formBuilder.group({
        adminID: [null, [Validators.required]],
        password: [null, Validators.required]
      });
      
  }

  isFieldInvalid(field: string) {
    return !this.adminLogin.get(field).valid && this.adminLogin.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.adminLogin.get(field).valid && this.adminLogin.get(field).touched;
  }

  onSubmit() {

    this.validateAllFormFields(this.adminLogin);
    if (this.adminLogin.valid) {
      this.formData = this.adminLogin.value;

         this.body = {
                    formData: this.formData
        };
        // Handle saving form data
        // this.myHttpService.login(this.formData).subscribe(response => {
        //
        // });
        const url = `${environment.apiUrl}/admin`;
        
        this.http.post(url, this.formData,{ responseType: 'json' }).subscribe(
        
        (response: any) => {
            // Handle the response here
            const routeId = response.routeid;
            // this.router.navigate(['/adminDashboard']);
            window.location.href = 'http://localhost:4200/adminDashboard';
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
    

      // this.recaptchaV3Service.execute('importantAction').subscribe((token: string) => {
      //   const formData = this.registerForm.value;
      //   this.tokenVisible = true;
      //   this.reCAPTCHAToken = `Token [${token}] generated`;
      //   // this.http.post(formData);
          
      // }
      
      // );
  
    }
    


