import { RequestsService } from './../services/requests.service';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../iterfaces/user';
import { UserService } from '../services/user.service';
import { auth } from 'firebase';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  friends: User[];
  query: string;
  friendEmail: '';

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private requestsService: RequestsService,
    private router: Router,
    private modalService: NgbModal ) {

      /*-- get friends --*/
    this.userService.getUsers().valueChanges().subscribe((data: User[]) => {
      this.friends = data;
    }, (error) => {
      console.log(error);
    });

    /*-- ge user --*/
    this.authenticationService.getStatus().subscribe((sesion) => {
      this.userService.getUserById(sesion.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        if (this.user.friends) {
          this.user.friends = Object.values(this.user.friends);
        }
      });
    });
  }

  logout() {
    this.authenticationService.logout()
    .then( (data) => { this.router.navigate(['login']); })
    .catch((error) => {console.log(error); });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    }, (reason) => {
    })
    .catch((error) => {console.log(error); });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending'
    };
    console.log(request);
    this.requestsService.createRequest(request)
    .then((data ) => {
      console.log(data);
    })
    .catch((error) => { console.log(error); });

  }

  ngOnInit() {
  }

}
