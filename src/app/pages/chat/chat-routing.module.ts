import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatviewComponent } from './chatview.component';


const routes: Routes = [
  {path: 'chat/chat-view', component: ChatviewComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
