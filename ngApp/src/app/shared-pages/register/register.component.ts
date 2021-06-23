import { UsersEnum } from './../../common/model/userEnum';
import { UserModel } from './../../common/model/userModel';
import { ErrorMsg } from './../../common/constants/errorMsg';
import { NotifierService } from './../../service/notifier/notifier.service';
import { FormErrorStateMatcher } from './../../common/errorStateMatcher/FormErrorStateMatcher';
import { EthcontractService } from './../../service/ethcontract.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  matcher = new FormErrorStateMatcher();
  userModel: UserModel;
  userRole = UsersEnum;
  keys;
  role: UsersEnum = UsersEnum.Other;

  constructor(
    private ethcontractService: EthcontractService,
    private formBuilder: FormBuilder,
    private notifierService: NotifierService
  ) {
    this.keys = Object.keys(this.userRole);
  }

  ngOnInit(): void {
    this.initForm();
    this.initAndDisplayAccount();
  }

  initForm() {
    this.registerForm = this.formBuilder.group({
      role: [UsersEnum.Other, Validators.required],
      userName: ['', Validators.required],
      manufacturerName: ['', Validators.required],
      fullName: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]]
    });

    this.addSubscription();
  }

  addSubscription() {
    this.form.role.valueChanges.subscribe(x => {
      this.role = x;
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
    return this.registerForm.controls;
  }

  onRegister() {
    if (this.registerForm.invalid) {
      return;
    }

    this.userModel = {
      userName: this.form.userName.value,
      companyOrFullName: this.form.fullName.value,
      email: this.form.email.value,
      userRole: this.form.role.value,
      manufacturerName: this.form.manufacturerName.value
    }

    this.ethcontractService.register(this.userModel)
      .subscribe(
        res => {
          console.log(res);
          this.notifierService.showNotification(ErrorMsg.registerSuccessMsg, "OK", "success");
        },
        error => {
          console.log(error);
          if ((error.error).includes("address")) {
            this.notifierService.showNotification(ErrorMsg.publicAddressExistsErrorMsg, "OK", "error");
          }
        }
      );
  }

  onClear() {
    this.form.userName.setValue('');
    this.form.companyName.setValue('');
    this.form.email.setValue('');
  }

}
