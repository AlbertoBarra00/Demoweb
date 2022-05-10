import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, environment.SECRET_KEY.trim()).toString();
  }

  decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, environment.SECRET_KEY.trim().trim()).toString(CryptoJS.enc.Utf8);
  }
}
