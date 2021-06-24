import { UserModel } from './../common/model/userModel';
import { environment } from './../../environments/environment.prod';
import { Product } from './../common/constants/product';
import { Injectable } from '@angular/core';
import Web3 from 'web3';
// const Web3 = require('web3');
// import * as Web3 from 'web3';
import * as TruffleContract from 'truffle-contract';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

declare let require: any;
declare let window: any;

let tokenAbi = require('../../../build/contracts/Product.json');
const contract = require('truffle-contract');
var Personal = require('web3-eth-personal');

@Injectable({
  providedIn: 'root'
})
export class EthcontractService {
  private web3Provider: any;
  private contracts: {};
  private enable: any;
  private account: any = null;
  private userModel: UserModel;
  private currentUserSubject: BehaviorSubject<UserModel>;
  public currentUser: Observable<UserModel>;
  public isAuthenticated = new BehaviorSubject<boolean>(false);

  MetaCoin = contract(tokenAbi);

  constructor(
    private http: HttpClient
  ) {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      if (typeof window.web3 !== 'undefined') {
        this.web3Provider = window.web3.currentProvider;
      } else {
        this.web3Provider = new Web3.providers.HttpProvider('http://localhost:9545');
      }
      console.log('transfer.service :: constructor :: window.ethereum');
      window.web3 = new Web3(window.ethereum);
      console.log('transfer.service :: constructor :: this.web3');
      console.log(this.web3Provider);
      // this.enable = this.enableMetaMaskAccount();
      this.enable = this.enableMetaMaskAccount();
    }

    this.currentUserSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('DAppToken')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.ethereum.enable();
    });
    return Promise.resolve(enable);
  }

  public async getAccount(): Promise<any> {
    console.log('transfer.service :: getAccount :: start');
    if (this.account == null) {
      this.account = await new Promise((resolve, reject) => {
        console.log('transfer.service :: getAccount :: eth');
        console.log(window.web3.eth);
        window.web3.eth.getAccounts((err, retAccount) => {
          console.log('transfer.service :: getAccount: retAccount');
          console.log(retAccount);
          if (retAccount.length > 0) {
            this.account = retAccount[0];
            resolve(this.account);
          } else {
            alert('transfer.service :: getAccount :: no accounts found.');
            reject('No accounts found.');
          }
          if (err != null) {
            alert('transfer.service :: getAccount :: error retrieving account');
            reject('Error retrieving account');
          }
        });
      }) as Promise<any>;
    }
    return Promise.resolve(this.account);
  }

  public async signIn(user: UserModel): Promise<any> {
    const publicAddress = this.account;
    const msg = `I am signing my one-time nonce: ${user.nonce}`;
    console.log(window.web3);

    return new Promise((resolve, reject) => {
      window.web3.eth.personal.sign(window.web3.utils.fromUtf8(msg), publicAddress, (err, signature) => {
        if (err) return reject(err);
        return resolve({ publicAddress, signature })
      });
    }) as Promise<any>;
  }

  public async getUserBalance(): Promise<any> {
    const account = await this.getAccount();
    console.log('transfer.service :: getUserBalance :: account');
    console.log(account);
    return new Promise((resolve, reject) => {
      window.web3.eth.getBalance(account, function (err, balance) {
        console.log('transfer.service :: getUserBalance :: getBalance');
        console.log(balance);
        if (!err) {
          const retVal = {
            account: account,
            balance: balance
          };
          console.log('transfer.service :: getUserBalance :: getBalance :: retVal');
          console.log(retVal);
          resolve(retVal);
        } else {
          reject({ account: 'error', balance: 0 });
        }
      });
    }) as Promise<any>;
  }

  setName(value) {
    const that = this;
    console.log('transfer.service :: transferEther to: ' +
      value.transferAddress + ', from: ' + that.account + ', amount: ' + value.amount);
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: transferEther :: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi);
      transferContract.setProvider(that.web3Provider);
      console.log('transfer.service :: transferEther :: transferContract');
      console.log(transferContract);
      transferContract.deployed().then(function (instance) {
        return instance.setName(
          value,
          {
            from: that.account,
            value: value.amount
          });
      }).then(function (status) {
        if (status) {
          return resolve({ status: true });
        }
      }).catch(function (error) {
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }

  getName() {
    const that = this;
    return new Promise((resolve, reject) => {
      console.log('transfer.service :: transferEther :: tokenAbi');
      console.log(tokenAbi);
      const contract = require('@truffle/contract');
      const transferContract = contract(tokenAbi);
      transferContract.setProvider(that.web3Provider);
      console.log('transfer.service :: transferEther :: transferContract');
      console.log(transferContract);
      transferContract.deployed().then(function (instance) {
        return instance.getName.call(
          {
            from: that.account
          }
        );
      }).then(function (status) {
        if (status) {
          console.log(status)
        }
      }).catch(function (error) {
        console.log(error);
        return reject('transfer.service error');
      });
    });
  }

  addNewProduct(product: Product): Observable<any> {

    console.log(product);
    // product.manufactDate = "12/23/23";
    product.serialNo = 1;

    const contract = require('@truffle/contract');
    const transferContract = contract(tokenAbi);
    transferContract.setProvider(this.web3Provider);

    return Observable.create(observer => {
      transferContract
        .deployed()
        .then(instance => {
          return instance.newProduct(
            product.manufacturerName,
            product.ownerName,
            product.serialNo,
            product.name,
            product.price,
            product.manufactDate, {
            from: this.account
          });
        })
        .then((value) => {
          // console.log(value.logs[0].args[0].words[0]);
          observer.next(value)
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

  changeOwner(id: number, owner: string, ownerName: string): Observable<any> {

    const contract = require('@truffle/contract');
    const transferContract = contract(tokenAbi);
    transferContract.setProvider(this.web3Provider);

    return Observable.create(observer => {
      transferContract
        .deployed()
        .then(instance => {
          return instance.changeOwner(
            id,
            owner,
            ownerName, {
            from: this.account
          });
        })
        .then((value) => {
          observer.next(value)
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })
  }

  getProduct(id: number): Observable<any> {
    const that = this;

    const contract = require('@truffle/contract');
    const transferContract = contract(tokenAbi);
    transferContract.setProvider(this.web3Provider);

    return Observable.create(observer => {
      transferContract
        .deployed()
        .then(instance => {
          return instance.getProduct.call(id, {
            from: this.account
          });
        })
        .then((value) => {
          observer.next(value)
          observer.complete()
        })
        .catch(e => {
          console.log(e);
          observer.error(e)
        });
    })

  }

  getAccountInfo() {

    console.log(this.web3Provider);
  }

  metamaskLogin() {
    this.userModel = { publicAddress: this.account };
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<UserModel>(`${environment.apiUrl}login`, this.userModel, { headers: httpHeaders });
  }

  register(userModel: UserModel) {
    userModel.publicAddress = this.account;
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<UserModel>(`${environment.apiUrl}register`, userModel, { headers: httpHeaders });
  }

  authenticate(data: any) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<UserModel>(`${environment.apiUrl}authenticate`, data, { headers: httpHeaders })
      .pipe(map(result => {
        localStorage.setItem('DAppToken', JSON.stringify(result));
        this.currentUserSubject.next(result);
        return result;
      }));
  }

  checkAuthenticated() {
    const local = JSON.parse(localStorage.getItem('DAppToken'));
    if (local) {
      if (local.token) {
        this.currentUserSubject.next(local);
        this.isAuthenticated.next(true);
        return this.isAuthenticated.value;
      }
    }
    this.isAuthenticated.next(false);
    this.currentUserSubject.next(null);
    return this.isAuthenticated.value;
  }

  updateProfile(data: UserModel) {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    data.publicAddress = this.account;
    data.manufacturerName = this.currentUserValue.manufacturerName;

    console.log(data);
    return this.http.post<UserModel>(`${environment.apiUrl}update-profile`, data, { headers: httpHeaders })
      .pipe(map(result => {
        localStorage.setItem('DAppToken', JSON.stringify(result));
        this.currentUserSubject.next(result);
        return result;
      }));
  }

  isLoggedIn():boolean {
    return !!(localStorage.getItem('DAppToken'));
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('DAppToken');
    this.currentUserSubject.next(null);
  }
}
