import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent  implements OnInit {
  title = 'carbookingsystem';
  loginForm: FormGroup;
  submitted = false; 
  formData: any;
   body: any;
   
  
  constructor(private formBuilder: FormBuilder,  private http: HttpClient) {}
  ngOnInit() {
      this.loginForm = this.formBuilder.group({
        UserEmailId: [null, [Validators.required, Validators.email]],
        password: [null, Validators.required]
      });
      
  }

  isFieldInvalid(field: string) {
    return !this.loginForm.get(field).valid && this.loginForm.get(field).touched;
  }

  isFieldValid(field: string) {
    return this.loginForm.get(field).valid && this.loginForm.get(field).touched;
  }

  onSubmit() {

    this.validateAllFormFields(this.loginForm);
    if (this.loginForm.valid) {
      this.formData = this.loginForm.value;

         this.body = {
                    formData: this.formData
        };
        // Handle saving form data
        // this.myHttpService.login(this.formData).subscribe(response => {
        //
        // });
        
        const url = `${environment.apiUrl}/login`;
        this.http.post(url, this.formData,{ responseType: 'text' }).subscribe(
        
        (response: any) => {
          console.log(response);
          localStorage.setItem('user', JSON.stringify(response));
          
          setTimeout(() => {
            window.location.href = 'http://localhost:4200/userDashboard';
          }, 1000);
            // Handle the response here
            // window.location.href = 'http://localhost:4200/userDashboard';
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
    


