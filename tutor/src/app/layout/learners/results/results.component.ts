import { Component, OnInit } from '@angular/core';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  constructor(public helperService: HelperService) { }

  ngOnInit() {
    this.helperService.loadDataTable();
  }

}
