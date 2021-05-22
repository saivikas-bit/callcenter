import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountToDirective } from './directives/count-to.directive';



@NgModule({
  declarations: [CountToDirective],
  imports: [
    CommonModule
  ],
  exports: [CountToDirective]
})
export class SharedModule { }
