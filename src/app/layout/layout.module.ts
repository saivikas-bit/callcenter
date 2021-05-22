import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LayoutRoutingModule } from './layout-routing.module';
import { FooterComponent } from './footer/footer.component';
import { TopbarComponent } from './topbar/topbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutComponent } from './layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxTimerModule } from 'ngx-timer';

@NgModule({
  declarations: [FooterComponent, TopbarComponent, SidebarComponent, LayoutComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgbDropdownModule,
    ReactiveFormsModule,
    LayoutRoutingModule,
    NgxTimerModule
  ]
})
export class LayoutModule { }
