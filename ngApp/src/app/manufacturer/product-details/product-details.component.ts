import { ErrorMsg } from './../../common/constants/errorMsg';
import { NotifierService } from './../../service/notifier/notifier.service';
import { UserModel } from './../../common/model/userModel';
import { Product } from './../../common/constants/product';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  // @Input() max: D | null;
  productForm: FormGroup;
  lat: number;
  lng: number;
  qrData: string = "";
  productId: number;
  added: Boolean = false;
  generated: Boolean = false;
  href: string;
  elementType: 'url' | 'canvas' | 'img' = 'url';
  currentUser: UserModel;
  today = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService,
    private notifierService: NotifierService
  ) {
    this.initAndDisplayAccount();
  }

  ngOnInit(): void {
    this.initForm();
    this.setMap();
    this.currentUser = this.ethcontractService.currentUserValue;
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

  initForm() {
    this.productForm = this.formBuilder.group({
      serialNo: [''],
      productName: ['', Validators.required],
      date: ['', Validators.required],
      price: ['', Validators.required]
    });
  }

  setMap() {
    if (!navigator.geolocation) {
      console.log('location is not supported..!');
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const coords = position.coords;
      this.lat = coords.latitude;
      this.lng = coords.longitude;

      const latLng = [coords.latitude, coords.longitude];
    });
  }

  get form() {
    return this.productForm.controls;
  }

  onAdd() {
    // this.setNewProduct();
    this.addNewProduct();
  }

  onCancel() {
    // this.getProduct(2);

    this.added = false;
  }

  onGenerateQR() {
    this.generated = true;
  }

  addNewProduct = () => {
    let data: Product = {
      ownerName: this.currentUser.companyOrFullName,
      serialNo: this.form.serialNo.value,
      name: this.form.productName.value,
      price: this.form.price.value,
      manufactDate: moment(this.form.date.value).format("DD/MM/yyyy").toString()
    }

    this.ethcontractService.addNewProduct(data)
      .subscribe(data =>{
        this.added = true;
        this.productId = data.logs[0].args[0].words[0];
        this.productId = this.productId + 1;
        this.qrData = `
        Product Id: ${data.logs[0].args[0].words[0]}
        Product Name: ${data.logs[0].args[3]}
        Product Price: ${data.logs[0].args[4].words[0]}
        Manufacturing Date: ${data.logs[0].args[5]}
        Owner Name: ${data.logs[0].args[2]}`;
        this.notifierService.showNotification(ErrorMsg.addNewProductMsg('success'), "OK", "success");
        console.log(this.qrData);
        console.log(data);
      }, e => {
        this.notifierService.showNotification(ErrorMsg.addNewProductMsg('error'), "OK", "success");
        console.log(e);
      })
  };

  // setNewProduct() {

  //   const that = this;
  //   this.form.serialNo.setValue(1);

  //   let data: Product = {
  //     ownerName: this.currentUser.companyOrFullName,
  //     serialNo: this.form.serialNo.value,
  //     name: this.form.productName.value,
  //     price: this.form.price.value,
  //     manufactDate: moment(this.form.date.value, "MM/DD/YYYY").toString()
  //   }

  //   this.added = true;

  //   this.ethcontractService.setNewProduct(data).then(function(value) {
  //     console.log(value);
  //     that.added = true;
  //     console.log(this.added.value);
  //     alert(this.added.value);
  //   }).catch(function(error) {
  //     console.log(error);
  //   });
  // }

  getProduct(id: number) {
    const value: any = {
      transferAddress: '',
      amount: '2'
    }

    this.ethcontractService.getProduct(id)
      .subscribe(data =>{
        console.log(data);
      }, e => {console.log(e);})
  }

  // onGet() {
  //   // this.getProduct(1);
  //   this.ethcontractService.signIn();
  // }

  onSaveQr(qr) {
    const parentElement = qr.el.nativeElement.querySelector("img").src;
    console.log(parentElement);
  }

  download() {
    this.href = document.getElementsByTagName('img')[0].src;
  }

  getBase64Image(img) {
    debugger;
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }


}
