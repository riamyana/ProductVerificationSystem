import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'your first DApp in Angular';
  accounts: any;
  transferFrom = '0x0';
  balance = '0 ETH';
  transferTo = '';
  amount = 0;
  remarks = '';
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService
  ) {
    this.initAndDisplayAccount();
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [''],
    });
  }

  initAndDisplayAccount = () => {
    let that = this;
    // this.ethcontractService.getUserBalance().then(function(acctInfo : any){
    //   console.log(acctInfo);
    //   that.transferFrom = acctInfo.fromAccount;
    //   that.balance = acctInfo.balance;
    // }).catch(function(error){
    //   console.log(error);
    // });

    this.ethcontractService.getUserBalance().
      then(function (retAccount: any) {
        // that.user.address = retAccount.account;
        // that.user.balance = retAccount.balance;
        // console.log('transfer.components :: getAccountAndBalance :: that.user');
        console.log(retAccount);
      }).catch(function (error) {
        console.log(error);
      });

    this.ethcontractService.getAccountInfo();

  };

  setName() {
    const value: any = {
      transferAddress: '',
      amount: '2'
    }
    this.ethcontractService.setName(this.form.get('name').value).then(function(value) {
      console.log(value);
    }).catch(function(error) {
      console.log(error);
    });
  }

  getName() {
    const value: any = {
      transferAddress: '',
      amount: '2'
    }
    this.ethcontractService.getName().then(function(status) {
      if (status) {
        console.log(status);
        return status;
      }
    }).catch(function(error) {
      console.log(error);
    });
  }

  set() {
    this.setName();
  }

  get() {
    this.getName();
    // alert(this.form.get('name').value);
  }

}
