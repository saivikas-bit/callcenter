import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as io from 'socket.io-client';
import { Ticket } from './models/ticket.model';
declare const Twilio: any;
@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  baseApiUrl: any = environment.baseApiUrl;
  baseApiUrl2: any = environment.baseApiUrl2;
  private url = 'http://localhpst:3000';
  private socket;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(public http: HttpClient) {
    // this.socket = io.connect(this.url, {
    // });
    Twilio.Device.ready(function () {
      console.log('Connected')
    });
  }
  getTickets(page, pageSize, sortBy) {
    return this.http.get(this.baseApiUrl + 'tickets?page= ' + page + '&pageSize=' + pageSize + '&sortBy=' + sortBy)
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }
  getTicketsSummary() {
    return this.http.get(this.baseApiUrl + 'ticketSummary')
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }
  answerCall(CallSid) {
    return this.http.get('http://localhost:3000/answerCall?id=' + CallSid)
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }
  setupTwilio() {
    // tslint:disable-next-line: max-line-length
    // Twilio.Device.setup('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNjb3BlOmNsaWVudDppbmNvbWluZz9jbGllbnROYW1lPUtpbGxlckdyYWNpZVhpYW9KaW4gc2NvcGU6Y2xpZW50Om91dGdvaW5nP2FwcFNpZD1BUDBlYTA5ZDlhY2MzMDRlNjE4MzY2YzlmNmFjZmViNTJkJmNsaWVudE5hbWU9S2lsbGVyR3JhY2llWGlhb0ppbiIsImlzcyI6IkFDYzQ3MWI5ZjdkYzhmZjc1ZGIzZmIzZmUyYzFmMjk2M2EiLCJleHAiOjE1ODQzODY5ODYsImlhdCI6MTU4NDM4MzM4Nn0.os3cl-Zm-r2Ud5atU91vO57DC-A-QJkGkzQTiM7qeAo', {
    //   audioConstraints: {
    //     optional: [
    //       { googAutoGainControl: false }
    //     ]
    //   }
    // });
    //John -WKf7663be70dce5424a1dedc44dc176c60
    //Alice- WKa0ecdaf7dd73e15d2cdbae3c9dc49a9f
    //Bob - WK3f819d89924b4480006146da841c5ab7
    return this.http.post('http://ec2-18-188-72-14.us-east-2.compute.amazonaws.com/api/agents/login',
      { "worker": { "SID": "WKa0ecdaf7dd73e15d2cdbae3c9dc49a9f" } },
      { responseType: 'text' })
      .toPromise()
      .then(res => res)
      .catch(this.handleError);
  }
  handleError(error: any): Promise<any> {
    if (error.status === 500) {
      return Promise.reject(error);
    }
    if (error.status === 401) {
      // localStorage.clear();
      return Promise.reject(error);
    }
    return Promise.reject(error.message || error);
  }
  getAllTickets() {
    return this.http.get<Ticket[]>(`${this.baseApiUrl2}tickets`)
  }




}
