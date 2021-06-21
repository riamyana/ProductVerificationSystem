import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-change-ownership',
  templateUrl: './change-ownership.component.html',
  styleUrls: ['./change-ownership.component.css']
})
export class ChangeOwnershipComponent implements OnInit {
  changeOwnerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService
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
    this.ethcontractService.changeOwner(this.form.id.value, this.form.address.value, this.form.ownerName.value)
    .subscribe((value) => {
      console.log(value);
    }, (err) => {
      console.log(err);
    });
  }

}
