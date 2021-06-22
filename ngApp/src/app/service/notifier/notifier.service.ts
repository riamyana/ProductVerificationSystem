import { NotifierComponent } from './../../shared/notifier/notifier.component';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar: MatSnackBar) { }

  showNotification(message: string, buttonMessage: string, error: string) {
    this.snackBar.openFromComponent( NotifierComponent, {
      data: {
        msg: message,
        btnMsg: buttonMessage,
        err: error
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: error
    });
  }
}
