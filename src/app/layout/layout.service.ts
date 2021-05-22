import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  twilioApiUrl: any = environment.twilioApiUrl;
  constructor(public http: HttpClient) { }
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
   return this.http.post(`${this.twilioApiUrl}agents/login`,
    {"worker": {"SID": JSON.parse(localStorage.getItem('userData')).secret}},
    { responseType: 'text' })
    .toPromise()
    .then(res=> res)
    .catch(this.handleError);
  }
  getConferenceData(callSid) {
    return this.http.get(`${this.twilioApiUrl}phone/call/${callSid}/conference`)
    .toPromise()
    .then(res => res)
    .catch(this.handleError);
  }
  transferCall(callSid, body) {
    return this.http.post(`${this.twilioApiUrl}phone/transfer/${callSid}`, body)
    .toPromise()
    .then(res => res)
    .catch(this.handleError);
  }
  holdCall(body) {
    return this.http.post(`${this.twilioApiUrl}phone/hold/`, body)
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
}
