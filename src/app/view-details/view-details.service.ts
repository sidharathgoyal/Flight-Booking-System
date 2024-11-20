import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FlightBooking } from '../shared/FlightBooking';
import { Observable } from 'rxjs';

@Injectable()
export class ViewDetailsService {
  private apiUrl = 'http://localhost:1020/flights';  // Base URL for booking-related endpoints

  constructor(private http: HttpClient) {}

  // Fetch all flight bookings
  view(): Observable<FlightBooking[]> {
    // Sends a GET request to fetch all the bookings
    return this.http.get<FlightBooking[]>(this.apiUrl);
  }

  // Delete a booking by id
  delete(id: any): Observable<any> {
    // Sends a DELETE request to delete a specific booking by id
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete(url);
  }
}
