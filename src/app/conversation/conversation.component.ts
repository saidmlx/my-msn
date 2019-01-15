import { AngularFireStorage } from 'angularfire2/storage';
import { AuthenticationService } from './../services/authentication.service';
import { ConversationService } from './../services/conversation.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../iterfaces/user';


@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {
  friendId: any;
  friend: User;
  user: User;
  conversation_uid: string;
  conversation: any;
  textMessage: String = '';
  shake = false;


  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService,
    private firebaseStorage: AngularFireStorage
    ) {

    this.friendId = this.activatedRoute.snapshot.params['uid'];
    /*--get friend--*/
    console.log(this.friendId);
    this.userService.getUserById(this.friendId).valueChanges().subscribe((data: User) => {
      this.friend = data;
      /*-- ge user --*/
      this.authenticationService.getStatus().subscribe((sesion) => {
        this.userService.getUserById(sesion.uid).valueChanges().subscribe((user: User) => {
          this.user = user;
          const uids = [ this.friend.uid, this.user.uid].sort();
          this.conversation_uid = uids.join('|');
          this.getConversation();

        });
      });

    }, (error) => {
      console.log(error);
    });

  }

  ngOnInit() {

  }

  sendMessage() {
    this.sendGenericMessage('text', this.textMessage );
  }

  sendGenericMessage(typeText: string, messageText) {
    const message = {
      uid: this.conversation_uid,
      timestamp: Date.now(),
      text: messageText,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: typeText

    };
    this.conversationService.createConversation( message ).then((data) => { this.textMessage = ''; });
  }

  getConversation() {
    this.conversationService.getConverstion(this.conversation_uid)
    .valueChanges().subscribe((data) => {
      this.conversation = data;
      this.conversation.forEach((message) => {
        if (!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);
          if (message.type === 'text') {
            const audio = new Audio('assets/sound/new_message.m4a');
            audio.play();
          } else if (message.type === 'zumbido') {
            this.doZumbido();
          }
        }
      });
    }, (error) => {console.log(error); });
  }
  sendZumbido() {
    const message = {
      uid: this.conversation_uid,
      timestamp: Date.now(),
      text: null,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    };
    this.conversationService.createConversation(message).then(() => {});
    this.doZumbido();
  }
  doZumbido() {
    const audio = new Audio('assets/sound/zumbido.m4a');
    audio.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }


  getUserNickByUid(uid) {
    if (uid === this.friend.uid) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }

  /** **/
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(image: string) {
    this.croppedImage = image;
    const currentImage = Date.now();
    const pictures = this.firebaseStorage.ref('messages/' + currentImage +     '.jpg').putString(this.croppedImage, 'data_url');
    pictures.then((result) => {
      this.picture = this.firebaseStorage.ref('messages/' + currentImage + '.jpg').getDownloadURL();
      this.picture.subscribe((p) => {
        this.sendGenericMessage('image', p );
      });
    });
  }
  imageLoaded() {
    // show cropper
  }
  loadImageFailed() {
    // show message
  }

}
