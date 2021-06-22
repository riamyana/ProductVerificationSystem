import { Router } from '@angular/router';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  login: Boolean = true;
  constructor(
    private ethcontractService: EthcontractService,
    private router: Router
  ) { }

  ngOnInit(): void {
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
