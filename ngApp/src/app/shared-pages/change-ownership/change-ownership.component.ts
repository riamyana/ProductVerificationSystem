import { ConfirmDialogComponent } from './../../shared/confirm-dialog/confirm-dialog.component';
import { ErrorMsg } from './../../common/constants/errorMsg';
import { NotifierService } from './../../service/notifier/notifier.service';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-change-ownership',
  templateUrl: './change-ownership.component.html',
  styleUrls: ['./change-ownership.component.css']
})
export class ChangeOwnershipComponent implements OnInit {
  changeOwnerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService,
    private notifierService: NotifierService,
    public dialog: MatDialog
  ) {
    this.initAndDisplayAccount();
  }

  ngOnInit(): void {
    this.initForm();
  }

  initAndDisplayAccount = () => {
    let that = this;

    this.ethcontractService.getUserBalance().
      then(function (retAccount: any) {
        console.log(retAccount);
      }).catch(function (error) {
        console.log(error);
      });

    this.ethcontractService.getAccountInfo();

  };

  initForm() {
    this.changeOwnerForm = this.formBuilder.group({
      id: ['', Validators.required],
      address: ['', Validators.required],
      ownerName: ['', Validators.required]
    });
  }

  get form() {
    return this.changeOwnerForm.controls;
  }

  onChangeOwner() {
    if (this.changeOwnerForm.invalid) {
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.ethcontractService.changeOwner(this.form.id.value, this.form.address.value, this.form.ownerName.value)
          .subscribe((value) => {
            this.notifierService.showNotification(ErrorMsg.addNewProductMsg('success'), "OK", "success");
            console.log(value);
          }, (err) => {
            this.notifierService.showNotification(ErrorMsg.changeOwnerMsg('success'), "OK", "success");
            console.log(err);
          });
      }
    });
  }

}
