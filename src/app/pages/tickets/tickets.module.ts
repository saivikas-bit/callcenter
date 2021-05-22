import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TicketsRoutingModule } from './tickets-routing.module';
import { AddUpdateViewTicketsComponent } from './add-update-view-tickets/add-update-view-tickets.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [AddUpdateViewTicketsComponent],
  imports: [
    CommonModule,
    TicketsRoutingModule,
    AutocompleteLibModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgbModule
  ],
  providers: [
    DatePipe
  ]
})
export class TicketsModule { }
