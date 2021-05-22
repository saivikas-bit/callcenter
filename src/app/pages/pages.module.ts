import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { TicketsModule } from './tickets/tickets.module';
import { ChatModule } from './chat/chat.module';
import { CreateAgentComponent } from './create-agent/create-agent.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
// import { TicketcreationComponent } from './ticketcreation/ticketcreation.component';

@NgModule({
  declarations: [CreateAgentComponent],
  imports: [
    CommonModule,
    PagesRoutingModule,
    DashboardModule,
    TicketsModule,
    ChatModule,
    SharedModule,
    NgbModule,
    FormsModule,
    NgMultiSelectDropDownModule.forRoot(),
  ]
})
export class PagesModule { }
