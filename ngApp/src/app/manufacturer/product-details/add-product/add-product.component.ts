import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm: FormGroup;
  lat: number;
  lng: number;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setMap();
  }

  initForm() {
    this.productForm = this.formBuilder.group({
      productId: [''],
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

  onAdd() {

  }

  onCancel() {

  }

}
