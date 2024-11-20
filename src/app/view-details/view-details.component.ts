import { Component, OnInit } from '@angular/core';
import { ViewDetailsService } from './view-details.service';
import { FlightBooking } from '../shared/FlightBooking';

@Component({
  selector: 'app-view-details',
  templateUrl: './view-details.component.html',
  styleUrls: ['./view-details.component.css'],
  providers: [ViewDetailsService],
})
export class ViewDetailsComponent implements OnInit {
  flightDetails: FlightBooking[] = []; // Store all bookings
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private viewService: ViewDetailsService) {}

  ngOnInit() {
    this.view();
  }

  view() {
    // Fetch all bookings from the service
    this.viewService.view().subscribe({
      next: (data: FlightBooking[]) => {
        this.flightDetails = data;
        this.successMessage = 'Flight bookings loaded successfully!';
      },
      error: (error) => {
        this.errorMessage = 'Failed to load bookings. Please try again later.';
        console.error('Error fetching bookings:', error);
      },
    });
  }

  delete(id: string, totalFare: number) {
    if (totalFare >= 5000) {
      this.errorMessage = 'Bookings with a total fare of 5000 or more cannot be deleted.';
      return;
    }

    if (confirm('Are you sure you want to delete this booking?')) {
      this.viewService.delete(id).subscribe({
        next: () => {
          this.successMessage = `Booking ID ${id} deleted successfully!`;
          // Remove the deleted booking from the list
          this.flightDetails = this.flightDetails.filter(
            (booking) => booking.id !== id
          );
        },
        error: (error) => {
          this.errorMessage = `Failed to delete booking ID ${id}. Please try again later.`;
          console.error('Error deleting booking:', error);
        },
      });
    }
  }
}
