import { AngularFireDatabase } from 'angularfire2/database';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  constructor(private angularFireDatabase: AngularFireDatabase) { }

  createRequest(request) {
    const cleanMail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/' + cleanMail + '/' + request.sender)
    .set(request);
  }
  setRequestStatus(request, status) {
    const cleanMail = request.receiver_email.replace('.', ',');
    return this.angularFireDatabase.object('requests/' + cleanMail + '/' + request.sender + '/status')
    .set(status);
  }
  getRequestsForEmail(email) {
    console.log('getRequestsForEmail ', email );

    const cleanMail = email.replace('.', ',');
    return this.angularFireDatabase.list('requests/' + cleanMail);
  }
}
