import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatlistComponent } from './chatlist/chatlist.component';
import { ChatdetailsComponent } from './chatdetails/chatdetails.component';
import { ChatinfoComponent } from './chatinfo/chatinfo.component';
import { ChatviewComponent } from './chatview.component';


@NgModule({
  declarations: [ChatviewComponent, ChatlistComponent, ChatdetailsComponent, ChatinfoComponent],
  imports: [
    CommonModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
