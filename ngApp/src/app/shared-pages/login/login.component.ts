import { Router } from '@angular/router';
import { UserModel } from './../../common/model/userModel';
import { ErrorMsg } from './../../common/constants/errorMsg';
import { NotifierService } from './../../service/notifier/notifier.service';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @Input() user_type;
  loginForm: FormGroup;
  hide = true;

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService,
    private notifierService: NotifierService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.initAndDisplayAccount();
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
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

  login() {
    this.ethcontractService.metamaskLogin()
      .subscribe(
        res => {
          console.log(res);
          this.signNonce(res);
        },
        error => {
          console.log(error);
          if ((error.error).includes("address")) {
            this.notifierService.showNotification(ErrorMsg.noPublicAddressErrorMsg, "OK", "error");
          }
        }
      );
  }

  signNonce(user: UserModel) {
    const that = this;

    this.ethcontractService.signIn(user).
      then(function (data: any) {
        console.log(data);
        // debugger;
        that.authenticate(data);
      }).catch(function (error) {
        // debugger;
        console.log(error);
      });;
  }

  authenticate(data: any) {
    this.ethcontractService.authenticate(data)
      .subscribe(result => {
        let role = result.userRole.toString();
        role = role.toLowerCase();
        this.router.navigateByUrl(`/${role}/home`);
        console.log(result);
      }, error => {
        this.notifierService.showNotification(ErrorMsg.somethingWentWrongErrorMsg, "OK", "error");
      });
  }

}
