import { AngularFireDatabase } from 'angularfire2/database';
import { AuthenticationService } from './../services/authentication.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../iterfaces/user';
import {AngularFireStorage} from 'angularfire2/storage';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(private userService: UserService,
    private authenticationService: AuthenticationService,
    private firebaseStorage: AngularFireStorage) {

      this.authenticationService.getStatus().subscribe((status) => {
        this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
          console.log( data );
          this.user = data;
        },
        (error) => {console.log(error); }
        );
      },
      (error) => {console.log(error); } );
  }
  ngOnInit() {
  }

  save() {
    if (this.croppedImage) {

      const currentImage = Date.now();

      const pictures = this.firebaseStorage.ref('pictures/' + currentImage +     '.jpg').putString(this.croppedImage, 'data_url');

      pictures.then((result) => {

        this.picture = this.firebaseStorage.ref('pictures/' + currentImage + '.jpg').getDownloadURL();


        this.picture.subscribe((p) => {
          console.log('--->', p);
          this.userService.setAvatar(p, this.user.uid)
          .then(
            (data) => {console.log(data); },
            (error) => {console.log( error); } );
        });
      }, (error) => {console.log( error); } );

    } else {
      this.userService.editUser(this.user)
      .then((data) => {console.log(data); } , (error) => {console.log(error); } );
    }
  }


  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }
}
