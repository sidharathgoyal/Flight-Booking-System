import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, Observable, of} from 'rxjs';
import { Flights } from '../shared/Flight';

@Injectable()
export class BookFlightService {
  flightDetail!: any;
  error!: any;
  errorMessage!: String;

  private flightsUrl = 'http://localhost:1020/flights';
  private bookingsUrl = 'http://localhost:1020/bookings';

  constructor(private http: HttpClient) { }

  bookFlight(data: any): Observable<any> {
    //Consume the exposed URI's specified in QP 
    return this.http.post<any>(this.bookingsUrl, data);
  }

  getAllFlights(): Observable<Flights[]> {
    //Consume the exposed URI's specified in QP 
    return this.http.get<Flights[]>(this.flightsUrl);
  }

  updateFlight(flightId: any, data: any): Observable<any> {
  
    //Consume the exposed URI's specified in QP 

    const url = `${this.flightsUrl}/${flightId}`;
    return this.http.patch<any>(url, data);
  }
}
