import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Ambientes } from '../helpers/constants/ambientes';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  public appConfig: any;
  public configGovbr: any;

  constructor(private _http: HttpClient) { }

  get getConfig() {
    return new Promise<void>((resolve) => {
      this._http.get(this.urlAtual).subscribe(
        (data: any) => {
          this.appConfig = data;
          resolve();
        }
      );
    })
  }
  
  get urlAtual() {
    const url: string = window.location.hostname;
    const urlFormatada: string[] = url.split(".");

    if(urlFormatada[0] == Ambientes.URL_BALANCE_HOM || url.includes(Ambientes.URL_SERVIDOR_HOM)) {
      return Ambientes.CONFIG_HOM;
    }
    else if(urlFormatada[0] == Ambientes.URL_BALANCE_PROD || url.includes(Ambientes.URL_SERVIDOR_PROD)) {
      return Ambientes.CONFIG_PROD;
    }
    else {
      return Ambientes.CONFIG_DES;
    }
  }
}