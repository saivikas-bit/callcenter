import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { TicketHistory } from './add-update-view-tickets/models/tickethistory.model';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {
  baseApiUrl: any = environment.baseApiUrl;
  baseApiUrl2: any = environment.baseApiUrl2;

  constructor(public http: HttpClient) { }
  getUsersList() {
    return this.http.get(`${this.baseApiUrl2}agents`)
  }
  getpriorityList() {
    return this.http.get(`${this.baseApiUrl2}prority`)
  }
  geturgencyList() {
    return this.http.get<any[]>(`${this.baseApiUrl2}urgency`)
  }
  getallgroups() {
    return this.http.get<any[]>(`${this.baseApiUrl2}Group`)
  }
  createTicket(body: Object) {
    return this.http.post(`${this.baseApiUrl2}createticket`, body)
  }
  getTicketByID(id) {
    return this.http.get(`${this.baseApiUrl2}ticket/${id}`)
  }
  updateTicket(object, id) {
    return this.http.put(`${this.baseApiUrl2}updateticket/${id}`, object)
  }
  getticketid() {
    return this.http.get(`${this.baseApiUrl2}ticketid`)
  }
  gettickethistory(id) {
    return this.http.get<TicketHistory[]>(`${this.baseApiUrl2}tickethistories/${id}`)
  }
  getgroupsusers(mailid) {
    return this.http.post<Array<Object>>(`${this.baseApiUrl2}getagentgroups`, { "mailid": mailid });
  }
  getusersgroups(name) {
    return this.http.post<Array<Object>>(`${this.baseApiUrl2}agentgroups`, { name: name })
  }
}
