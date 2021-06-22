import { UsersEnum } from './../../common/model/userEnum';
import { UserModel } from './../../common/model/userModel';
import { Router } from '@angular/router';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  userModel: UserModel;
  userEnum = UsersEnum;

  login: Boolean = true;
  constructor(
    public ethcontractService: EthcontractService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.ethcontractService.currentUser.subscribe(value => {
      this.userModel = value;
    });
  }

  onLogout() {
    this.login = false;
  }

  isLoggedIn(): boolean {
    return this.ethcontractService.isLoggedIn();
  }

  logout() {
    this.ethcontractService.logout();
    this.router.navigate(['login']);
  }

}
