import { Component, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { FileUploadService } from '../service/file-upload.service';
import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CustomerBookingService} from '../service/customer-booking.service';
@Component({
  selector: 'app-admindashboard',
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmindashboardComponent implements OnInit {

  car = {
    name: '',
    price: '',
    image: null
  };

  selectedFile: File | null = null;
  customerBookings: any[] = [];

  constructor(private fileUploadService: FileUploadService , private http: HttpClient, private customerBookingService: CustomerBookingService) {}
  ngOnInit(): void {
    this.customerBookingService.getCustomerBookings()
      .subscribe((data: any[]) => {
        this.customerBookings = data;
      });
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    console.log(fileList[0]);
  if (fileList.length > 0) {
    this.car.image = fileList[0];
    console.log(this.car.image.name)
  }
  }

  onSubmit() {

    const formData = new FormData();
    formData.append('name', this.car.name);
    formData.append('price', this.car.price);

    if (this.car.image) {
     
      formData.append('image', this.car.image,this.car.image.name);
    }else{
      console.log('imagepath not taken');
    }

    const url = `${environment.apiUrl}/cars`;
    this.http.post(url, formData).subscribe(
      (response) => {
        console.log('Car information and image saved successfully');
      },
      (error) => {
        console.error('Error saving car information and image:', error);
      }
    );
  }

    // if (this.selectedFile) {
    //   // Perform the upload logic here
    //   console.log('Uploading file:', this.selectedFile);
    //   this.fileUploadService.uploadFile(this.selectedFile).subscribe(
    //     (url: string) => {
    //       console.log('Upload success!', url);
    //     },
    //     (error) => {
    //       console.error('Upload error:', error);
    //     }
    //   );
    // }
  
}
