// car-booking.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CarBooking {
  id?: string;
  name: string;
  carModel: string;
  pickupDate: string;
  returnDate: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarBookingService {
 
     

  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<CarBooking[]> {
    const url = `${environment.apiUrl}/admin`;
    return this.http.get<CarBooking[]>(`${url}/bookings`);
  }

  createBooking(booking: CarBooking): Observable<CarBooking> {
    const url = `${environment.apiUrl}/bookings`;
    return this.http.post<CarBooking>(`${url}`, booking);
  }

  updateBooking(id: string, booking: CarBooking): Observable<CarBooking> {
    const url = `${environment.apiUrl}/admin`;
    return this.http.put<CarBooking>(`${url}/bookings/${id}`, booking);
  }

  deleteBooking(id: string): Observable<void> {
    const url = `${environment.apiUrl}/admin`;
    return this.http.delete<void>(`${url}/bookings/${id}`);
  }
  
}
