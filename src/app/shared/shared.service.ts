import { Injectable, EventEmitter, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public pageEvent: any = new EventEmitter();
  @Output() chatEvent: EventEmitter<any> = new EventEmitter<any>();
  public newMessage: any = new EventEmitter();
  public tagsEvent: any = new EventEmitter();
  constructor() { }
}
