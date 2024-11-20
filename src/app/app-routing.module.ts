import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookFlightComponent } from './book-flight/book-flight.component';
import { ViewDetailsComponent } from './view-details/view-details.component';
import { AppComponent } from './app.component';
//Add required imports


const routes: Routes = [
  //configure the routes here
  { path: 'home', component: AppComponent },
  { path: 'book-flight', component: BookFlightComponent },
  { path: 'book', component: BookFlightComponent },
  { path: 'view-details', component: ViewDetailsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
