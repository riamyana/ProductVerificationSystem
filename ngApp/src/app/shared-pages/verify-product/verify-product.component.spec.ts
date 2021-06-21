import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyProductComponent } from './verify-product.component';

describe('VerifyProductComponent', () => {
  let component: VerifyProductComponent;
  let fixture: ComponentFixture<VerifyProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerifyProductComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifyProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
