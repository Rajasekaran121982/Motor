import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CarBookingService, CarBooking } from '../service/carbooking.service';
import { getLocaleDateFormat } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar'; 

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  imageUrls: string[] = [];
  currentIndex: number = 0;
  bookingID: string;
  user: any;

  bookings: CarBooking[] = [];
  newBooking: CarBooking = {
    name: 'BMW', // Set the default name value
    carModel: '2023', // Set the default carModel value
    pickupDate: '2024-02-12', // Set the default pickupDate value
    returnDate: '2023-04-20', // Set the default returnDate value
  };
   
  
  constructor(private http: HttpClient,private carBookingService: CarBookingService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
   
    const config: MatSnackBarConfig = {
      duration: 5000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    };
   
    
    this.loadData();
    
    this.loadImages();
  }

  async loadData() {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    
    
    
    const jsonStringWithSingleQuotes =  JSON.parse(this.user)
     this.bookingID =jsonStringWithSingleQuotes.userid.replace(/@.*/, '');;
    
    
  }

  loadImages(): void {
   
    this.http.get<string[]>('http://localhost:3000/api/images').subscribe(
      (response) => {
        this.imageUrls = response;
      },
      (error) => {
        console.error('Error fetching images:', error);
      }
    );
  }
  nextImage(): void {
    
    this.currentIndex= (this.currentIndex + 1) % this.imageUrls.length;
    console.log(this.imageUrls[this.currentIndex] )
  }

  createBooking() {
   
   
    this.carBookingService.createBooking(this.newBooking).subscribe(
      (booking) => {
        this.bookings.push(booking);
        this.newBooking = {
          name: 'BMW', // Set the default name value
          carModel: '2023', // Set the default carModel value
          pickupDate: '2024-02-02', // Set the default pickupDate value
          returnDate: '2024-02-12', // Set the default returnDate value
        };
        
      //   const snack = this.snackBar.open('Booking Sucess', 'Action');
      // snack
      //   .onAction()
      //   .subscribe(() => {
      //     // Action...
      //   });
// Display a pop-up message
        this.openpop();


      },
      (error) => {
        console.error('Error creating car booking:', error);
      }
    );
  }
  openpop()
  {
    this.snackBar.open('Booking Successful', 'Close', {
      duration: 5000, 
    });
  }
  
}


