// import { waitForAsync } from '@angular/core/testing';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public baseUrl = environment.baseApiUrl;
  forgetpassword = true;
  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  error = '';
  loading = false;
  showErrorMessage: any = false;
  errorMessage: any;
  userList: any = [];
  userData: any;
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService, private http: HttpClient) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
    // this.getAllUsers();
    // tslint:disable-next-line: no-string-literal
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    document.body.classList.add('authentication-bg');
    document.body.classList.add('authentication-bg-pattern');
  }
  get f() { return this.loginForm.controls; }

  onSubmit = () => {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    const body = {
      email: this.f.email.value,
      password: this.f.password.value,
    };
    this.http.get<Object>(`${this.baseUrl}getUserEmailId?email=${body.email}&password=${body.password}`).toPromise().then(res => {
      // console.log(res);
      if (res !== null) {
        this.userData = res['roles'][0]['users'][0];
        console.log(this.userData)
        console.log('The users list---------------', this.userData);
      }
      if (this.userData != null) {
        localStorage.setItem('userData', JSON.stringify(this.userData));
        this.router.navigate(['/']);
      } else {
        this.error = 'Email and password is not match!';
      }

    })
  }
  // getAllUsers() {
  //   this.authService.allUser().then((res: any) => {
  //     console.log('The users list---------------', res);
  //     this.userList = res;
  //   });
  // }
  cancel() {
    this.forgetpassword = !this.forgetpassword;
  }
}
