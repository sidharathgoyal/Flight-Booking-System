import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { BookFlightService } from "./book-flight.service";
import { Flights } from '../shared/Flight';
import { catchError, of, tap } from 'rxjs';

@Component({
  selector: 'app-book-flight',
  templateUrl: './book-flight.component.html',
  styleUrls: ['./book-flight.component.css'],
  providers: [BookFlightService]
})
export class BookFlightComponent implements OnInit {

  errorMessage!: string;
  successMessage!: string;
  flights: Flights[] = [];
  bookingForm!: FormGroup;

  constructor(private fb: FormBuilder, private bookFlightService: BookFlightService) { }

  ngOnInit() {
    //Create the bookingForm FormGroup and get all the flight details
    
    this.bookingForm = this.fb.group({
      passengerName: ['', [Validators.required]],
      noOfTickets: ['', [Validators.required, Validators.min(1)]],
      flightId: ['', [Validators.required, this.validateFlight]]
    });

    this.bookFlightService.getAllFlights().pipe(
      tap((data: Flights[]) => {
        console.log("Fetched flight data:", data);
        this.flights = Array.isArray(data)?data:[];
      }),
      catchError((error) => {
        this.flights = [];
        this.errorMessage = "Failed to load flight details. Please try again later";
        console.error("Error fetching flight details:", error);
        return of([]);
      })
    ).subscribe();
    
  }
  book() {
    // Code the method here
    if(this.bookingForm.invalid){
      this.errorMessage = "Please correct the form errors.";
      return;
    }

    if (!Array.isArray(this.flights) || this.flights.length === 0) {
      this.errorMessage = "Flight data is not available.";
      return;
    }

    const {passengerName, noOfTickets, flightId} = this.bookingForm.value;

    const flight =  this.flights.find(f => f.id === flightId);

    if(!flight) {
      this.errorMessage = "Flight Unavailable!!";
      return;
    }

    if(flight.status === "Cancelled"){
      this.errorMessage = "Flight Cancelled!!";
      return;
    }

    if(noOfTickets > flight.availableSeats){
      this.errorMessage = "Requested number of seats unavailable!";
      return;
    }

    const totalFare = noOfTickets*flight.fare;

    const bookingData = {
      flightId,
      passengerName,
      noOfTickets,
      totalFare
    };

    this.bookFlightService.bookFlight(bookingData).subscribe({
      next: (response) => {
        const bookingId = response.bookingId || "N/A";
        this.successMessage = `Flight booking is successful with booking id: ${bookingId}`;
        this.errorMessage = "";

        const updatedSeats = flight.availableSeats - noOfTickets;
        const updateData = { availableSeats: updatedSeats };

        this.bookFlightService.updateFlight(flightId, updateData).subscribe({
          next: () => {
            console.log("Seats updated successfully");
          },
          error: (error) => {
            this.errorMessage = "Error updating flight seats.";
            this.successMessage = "";
            console.error("Error updating seats:", error);
          }
        });
      },
      error: (error) => {
        this.errorMessage = error.error.errorMessage || "Error booking flight.";
        this.successMessage = "";
        console.error("Error booking flight:", error);
      }
    });

  }

  // function validateFlight(c: FormControl)    -   original 
 validateFlight(c: FormControl) {
  /* 
     Code the validator here
     Use flightError as the property
 */
     const pattern = /^[A-z]{3}-\d{3}$/;
     if(!c.value || pattern.test(c.value)){
      return null;
     }
     return { flightError: "Invalid flight Id" };
}

}
