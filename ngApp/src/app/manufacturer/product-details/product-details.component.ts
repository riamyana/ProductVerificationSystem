import { Product } from './../../common/constants/product';
import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productForm: FormGroup;
  lat: number;
  lng: number;
  qrData: string = "";
  productId: number;
  // added: BehaviorSubject<Boolean>;
  added: Boolean = false;
  generated: Boolean = false;
  href: string;
  elementType: 'url' | 'canvas' | 'img' = 'url';

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService
  ) {
    this.initAndDisplayAccount();
    // this.added = new BehaviorSubject<Boolean>(false);
  }

  ngOnInit(): void {
    this.initForm();
    this.setMap();
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
    this.sendCoin();
  }

  onCancel() {
    // this.getProduct(2);

    this.added = false;
  }

  onGenerateQR() {
    this.generated = true;
  }

  sendCoin = () => {
    let data: Product = {
      ownerName: "ABC",
      serialNo: this.form.serialNo.value,
      name: this.form.productName.value,
      price: this.form.price.value,
      manufactDate: moment(this.form.date.value).format("DD/MM/yyyy").toString()
    }

    // console.log(data);
    // this.added = true;

    this.ethcontractService.sendCoin(data)
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
        console.log(this.qrData);
        console.log(data);
      }, e => {console.log(e);})
  };

  setNewProduct() {

    const that = this;
    this.form.serialNo.setValue(1);

    let data: Product = {
      ownerName: "ABC",
      serialNo: this.form.serialNo.value,
      name: this.form.productName.value,
      price: this.form.price.value,
      manufactDate: moment(this.form.date.value, "MM/DD/YYYY").toString()
    }

    this.added = true;

    this.ethcontractService.setNewProduct(data).then(function(value) {
      console.log(value);
      // this.added.next(true);
      that.added = true;
      console.log(this.added.value);
      alert(this.added.value);
    }).catch(function(error) {
      console.log(error);
    });
  }

  getProduct(id: number) {
    const value: any = {
      transferAddress: '',
      amount: '2'
    }
    // this.ethcontractService.getProduct(id).then(function(status) {
    //   if (status) {
    //     console.log(status);
    //     return status;
    //   }
    // }).catch(function(error) {
    //   console.log(error);
    // });

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

    // saveAs
  }

  download() {
    // debugger;
    // const qrcode = document.getElementById('qrcode');
    // let doc = new jsPDF();

    // let imageData= this.getBase64Image(qrcode.firstChild.firstChild);
    // doc.addImage(imageData, "JPG",10, 10, 10, 10);

    // doc.save('FirstPdf.jpg');

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
