import { EthcontractService } from './../../service/ethcontract.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViewChild } from '@angular/core';
import { ElementRef } from '@angular/core';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-verify-product',
  templateUrl: './verify-product.component.html',
  styleUrls: ['./verify-product.component.css']
})
export class VerifyProductComponent implements OnInit {
  qrResultString: string;
  verifyProductForm: FormGroup;
  fake: Boolean;
  afterClicked: Boolean = false;
  scan: Boolean = false;
  public imagePath;
  ownerName: string = "";
  value : any;
  @ViewChild('result') resultElement: ElementRef;
  showQRCode: boolean = false;
  elementType: 'url';

  constructor(
    private formBuilder: FormBuilder,
    private ethcontractService: EthcontractService,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.verifyProductForm = this.formBuilder.group({
      id: ['', Validators.required],
      qrcode: [''],
      uploadQr: ['']
    });
  }

  get form() {
    return this.verifyProductForm.controls;
  }

  onVerify() {
    this.getProduct(this.form.id.value);
    this.afterClicked = true;
  }

  getProduct(id: number) {
    this.ethcontractService.getProduct(id)
      .subscribe(data =>{
        console.log(data);
        this.ownerName = data[4];
        this.fake = false;
      }, e => {
        this.fake = true;
        console.log(e);
      })
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  clearResult() {
    this.qrResultString = null;
  }

  onScan() {
    this.scan = true;
  }

  imgInputChange(fileInputEvent: any) {
    const inputNode: any = document.querySelector('#file');
    // console.log(fileInputEvent.target.files[0]);
  }

  preview(files) {
    if (files.length === 0)
      return;
    var mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      alert("Only images are supported.");
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = (_event) => {
      this.value = reader.result;
      console.log(reader.result);
      this.showQRCode = true;
    }

  }

  render(e) {
    let element: Element = this.renderer.createElement('h1');
    element.innerHTML = e.result;
    this.renderElement(element);
  }

  renderElement(element) {
    for (let node of this.resultElement.nativeElement.childNodes) {
      this.renderer.removeChild(this.resultElement.nativeElement, node);
    }
    this.renderer.appendChild(this.resultElement.nativeElement, element);
  }

}
