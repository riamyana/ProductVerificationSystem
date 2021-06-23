import { UsersEnum } from './../../common/model/userEnum';
import { UserModel } from './../../common/model/userModel';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userModel: UserModel;
  userEnum = UsersEnum;

  constructor(
    public ethcontractService: EthcontractService
  ) { }

  ngOnInit(): void {
    this.ethcontractService.currentUser.subscribe(value => {
      this.userModel = value;
    });
  }

}
