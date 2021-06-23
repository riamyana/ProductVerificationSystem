import { ErrorMsg } from './../../common/constants/errorMsg';
import { UserModel } from './../../common/model/userModel';
import { EthcontractService } from './../../service/ethcontract.service';
import { NotifierService } from './../../service/notifier/notifier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  companyName: String;
  user: UserModel;

  constructor(
    private ethcontractService: EthcontractService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initAndDisplayAccount();
  }

  initForm() {
    this.profileForm = this.formBuilder.group({
      userName: [this.ethcontractService.currentUserValue.userName, Validators.required],
      companyName: [this.ethcontractService.currentUserValue.companyOrFullName, Validators.required],
      email: [this.ethcontractService.currentUserValue.email, [Validators.email, Validators.required]]
    });
  }

  initAndDisplayAccount = () => {

    this.ethcontractService.getUserBalance().
      then(function (retAccount: any) {
        console.log(retAccount);
      }).catch(function (error) {
        console.log(error);
      });

    this.ethcontractService.getAccountInfo();

  };

  get form() {
    return this.profileForm.controls;
  }

  onUpdateProfile() {
    this.user = {
      userName: this.form.userName.value,
      companyOrFullName: this.form.companyName.value,
      email: this.form.email.value
    };
    this.ethcontractService.updateProfile(this.user).subscribe(success => {
      this.notifierService.showNotification(ErrorMsg.updateProfileMsg('success'), "OK", "success");
      console.log(success);
    }, err => {
      console.log(err);
      this.notifierService.showNotification(ErrorMsg.updateProfileMsg('error'), "OK", "error");
    })
  }

  onClear() {
    this.form.userName.setValue('');
    this.form.companyName.setValue('');
    this.form.email.setValue('');
  }

}
