import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrencyApiHelper } from '../../../RestApiCall/ApiHelper/Currency.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

@Component({
  selector: 'app-primary-currency',
  templateUrl: './primary-currency.component.html',
  styleUrls: ['./primary-currency.component.scss']
})
export class PrimaryCurrencyComponent implements OnInit {

  User :any;
  currencyList = [];
  currencyId = undefined;

  loggedIn : any;

  constructor(public router: Router,protected serviceCurrency: CurrencyApiHelper, public snotify: TostNotificationService) { }

  ngOnInit(): void {

    this.User = JSON.parse(localStorage.getItem('User'));
    this.currencyId = this.User.currency_id;

    this.serviceCurrency.getCurrency().subscribe((res: ServerResponse) => {

      if (res != null && res.success && res.data != null) {
        
        this.currencyList = res.data;
      }
    },
      (err) => {

        console.log(err);
      });
  }

  submitButtonClick() {
    
    if (this.currencyId == undefined) {

      this.snotify.body = 'Please select currency.';
      this.snotify.onError();

    } else {
      
      let currencyData:{[k: string]: any} = {
        
        currencyId: this.currencyId,
      };

      this.serviceCurrency.primaryCurrency(currencyData).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        this.User['currency_id'] = this.currencyId;
        localStorage.setItem('User', JSON.stringify(this.User));

        this.router.navigate(['/setting']);
      },
        (err) => {

          this.snotify.body = err.error;
          this.snotify.onError();

          console.log(err);
    
        });
      
    }

  }

}
