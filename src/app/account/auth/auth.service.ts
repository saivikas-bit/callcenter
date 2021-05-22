import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public baseUrl = environment.baseApiUrl;
  public headers = {};
  constructor(private http: HttpClient) { 
    this.headers = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
  }
  allUser() {
    return this.http.get(this.baseUrl + 'users', this.headers)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }
  login(body: any) {
    return this.http.post(this.baseUrl, body)
    .toPromise()
    .then(response => response)
    .catch(this.handleError);
  }
  private handleError(error: any): Promise<any> {
    if (error.status === 401) {
      return Promise.reject(error);
    }
    if (error.status === 400) {
      return Promise.reject(error);
    }
    if (error.status === 500) {
      return Promise.reject(error);
    }
    if (error.status === 404) {
      return Promise.reject(error);
    }
    if (error.status === 601) {
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
}
