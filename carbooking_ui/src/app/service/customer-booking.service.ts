import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CustomerBookingService {
  
  constructor(private http: HttpClient) { }

  getCustomerBookings(): Observable<any[]> {
    const url = `${environment.apiUrl}/customerbookings`;
    return this.http.get<any[]>(url).pipe(
        map((bookings) => {
          return bookings.map((booking) => {
            // Extract the value from the Int object for the bookingId property
            return {
              bookingId: booking.bookingId.value, // Access the value property
              name: booking.name,
              carModel: booking.carModel,
              pickupDate: booking.pickupDate,
              returnDate: booking.returnDate,
            };
          });
        })
      );
  }
}
