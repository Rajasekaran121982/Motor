import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserRegisterModel} from '../model/UserRegisterModel';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { HttpClient } from '@angular/common/http';
import { userservice } from '../service/user.service';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'user-root',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  title = 'carbookingsystem';
  registerForm: FormGroup;
  submitted = false;
  reCAPTCHAToken: string = "";
  tokenVisible: boolean = false;
  
  
  
  // recaptchaV3Service: any;
  private siteKey ='6LeFrxcnAAAAADMJPixdURmMCKwR2B_uZmy1EKrL'
  formData: any;
   body: any;
   
   
  
  constructor(private formBuilder: FormBuilder, private recaptchaV3Service: userservice, private http: HttpClient) {}
  isDivEnabled: boolean = false;
  ngOnInit() {
    
      this.registerForm = this.formBuilder.group({
        UserName: [null, Validators.required],
        UserEmailId: [null, [Validators.required, Validators.email]],
        mobileno:  new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9+-]*') // Customize the pattern to fit your requirements
        ]),
        password: [null, Validators.required],
        Otp:[null],
        
      });
      this.recaptchaV3Service.init(this.siteKey);
  }

  isFieldInvalid(field: string) {
    return !this.registerForm.get(field).valid && this.registerForm.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.registerForm.get(field).valid && this.registerForm.get(field).touched;
  }

  onSubmit() {

    this.validateAllFormFields(this.registerForm);
    if (this.registerForm.valid) {
      this.recaptchaV3Service.getToken().then(token => {
        this.formData = this.registerForm.value;
        this.formData.recaptchaToken = token;

         this.body = {
          token: token,
          formData: this.formData
        };
        // Handle saving form data
        const url = `${environment.apiUrl}/register`;
        this.http.post(url, this.body,{ responseType: 'text' }).subscribe(
        
        (response: any) => {
            // Handle the response here
            
            this.isDivEnabled = true ;
            
            console.log(response);
            this.destroyRecaptcha();
          },
          error => {
            // Handle any errors here test
            console.log(this.body);
            console.error(error);
          }
        );


      }, error => {
		  console.log('err ',error)
	  });
  }
}
destroyRecaptcha() {
  this.recaptchaV3Service.destroy();
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


validateOTP() {
  const url = `${environment.apiUrl}/verify-otp`;
  if (this.registerForm.valid) {
    this.body = {
      
      formData: this.registerForm.value
    };
  }

  console.log(this.body);
  this.http.post(url, this.body,{ responseType: 'text' }).subscribe(
        
    (response: any) => {
        // Handle the response here
        window.location.href = 'http://localhost:4200/userDashboard';
        console.log(response);
      },
      error => {
        // Handle any errors here test
        console.log(this.body);
        console.error(error);
      }
    );

}
    
  
    }
    


