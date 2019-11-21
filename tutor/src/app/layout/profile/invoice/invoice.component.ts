import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { InvoiceApiHelper } from '../../../RestApiCall/ApiHelper/Invoice.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-invoice',
  providers: [InvoiceApiHelper],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  invoiceList = [];
  @ViewChild('printPdf', {static: true}) pdfTable: ElementRef;
  invoice : any;
  user : any;
  amountInWords : any;
  discountAmount = 0;
  a = ['','one ','two ','three ','four ', 'five ','six ','seven ','eight ','nine ','ten ','eleven ','twelve ','thirteen ','fourteen ','fifteen ','sixteen ','seventeen ','eighteen ','nineteen '];
  b = ['', '', 'twenty','thirty','forty','fifty', 'sixty','seventy','eighty','ninety'];
  n : any;
  showInvoice = false;
  chhattisgarhIds = [286, 543, 66, 109, 455, 681, 394, 131, 262, 101, 383, 900, 882, 730, 283, 36, 240, 865];
  isChhattisgarh = false;

  constructor(public router: Router,protected serviceInvoice: InvoiceApiHelper, public snotify: TostNotificationService) { }
  
  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('User'));

    for(let i=0 ; i< this.chhattisgarhIds.length;i++){
      if(this.user.city_id == this.chhattisgarhIds[i]){
        this.isChhattisgarh = true;
      }
    }

    if(this.user.userType != 1) {

      // Institute Login
      this.router.navigate(['/not-found']);
    }
    
    this.serviceInvoice.getInvoiceList().subscribe((res: ServerResponse) => {
      
      if (res != null && res.success && res.data != null) {
        
        this.invoiceList = res.data;
        
        this.invoiceList.forEach(invoice => {
          if(this.isChhattisgarh){
            if(invoice.gst){
              invoice.cgst = invoice.gst/2;
              invoice.sgst = invoice.gst/2;
            }
            if(invoice.gstAmount){
              invoice.cgstAmount = invoice.gstAmount/2;
              invoice.sgstAmount = invoice.gstAmount/2;
            }
          }
        });
      }
    },
      (err) => {

        console.log(err);
      });
  }

  printInvoice(invoice){
    // localStorage.setItem('invoice', JSON.stringify(invoice));
    this.invoice = invoice;
    this.getAmountInWords(Math.floor(this.invoice.total));

    this.discountAmount = this.invoice.amount * (this.invoice.discount/100);
    this.showInvoice = true;
    this.downloadInvoice();
  }

  getAmountInWords(num){
    if ((num = num.toString()).length > 9) return 'overflow';
    this.n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!this.n) return; var str = '';
    str += (this.n[1] != 0) ? (this.a[Number(this.n[1])] || this.b[this.n[1][0]] + ' ' + this.a[this.n[1][1]]) + 'crore ' : '';
    str += (this.n[2] != 0) ? (this.a[Number(this.n[2])] || this.b[this.n[2][0]] + ' ' + this.a[this.n[2][1]]) + 'lakh ' : '';
    str += (this.n[3] != 0) ? (this.a[Number(this.n[3])] || this.b[this.n[3][0]] + ' ' + this.a[this.n[3][1]]) + 'thousand ' : '';
    str += (this.n[4] != 0) ? (this.a[Number(this.n[4])] || this.b[this.n[4][0]] + ' ' + this.a[this.n[4][1]]) + 'hundred ' : '';
    str += (this.n[5] != 0) ? ((str != '') ? 'and ' : '') + (this.a[Number(this.n[5])] || this.b[this.n[5][0]] + ' ' + this.a[this.n[5][1]]) + 'only ' : '';
    this.amountInWords = str;
  }

  downloadInvoice(){
    var element = document.getElementById('invoice');
    var opt = {
      filename:     'invoice.pdf',
      image:        { type: 'jpeg', quality: .98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save().then(()=>{
      this.showInvoice = false;
    });
  }
}