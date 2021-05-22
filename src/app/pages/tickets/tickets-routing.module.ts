import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUpdateViewTicketsComponent } from './add-update-view-tickets/add-update-view-tickets.component';

const routes: Routes = [
  {path: 'tickets/ticket-view', component: AddUpdateViewTicketsComponent},
  {path: 'tickets/ticket-view/:id', component: AddUpdateViewTicketsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TicketsRoutingModule { }
