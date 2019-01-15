import { UserService } from './../services/user.service';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  operation: string;
  email: string;
  password: string;
  nick: string;

  constructor(private authenticationService: AuthenticationService,
    private userService: UserService,
    private router: Router) {
    this.operation = 'login';
  }

  ngOnInit() {
  }

  login() {

    this.authenticationService.loginWithEmail(this.email, this.password)
    .then((data) => {
      console.log( data );
      this.router.navigate(['home']);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  register() {
    this.authenticationService.registerWithEmail(this.email, this.password)
    .then((data) => {
      const user = {
        uid: data.user.uid,
        email: this.email,
        nick: this.nick
      };

      console.log( data );

      this.userService.createUser( user )
      .then( (dataUser) => {
        console.log(dataUser);
        this.router.navigate(['home']);
      })
      .catch((error) => {
        console.log(error);
      });

    })
    .catch((error) => {
      console.log(error);
    });
  }

}
