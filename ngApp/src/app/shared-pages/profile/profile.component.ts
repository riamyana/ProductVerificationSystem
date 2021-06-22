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
      userName: ['', Validators.required],
      companyName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
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
    alert("profile");
  }

  onClear() {
    this.form.userName.setValue('');
    this.form.companyName.setValue('');
    this.form.email.setValue('');
  }

}
