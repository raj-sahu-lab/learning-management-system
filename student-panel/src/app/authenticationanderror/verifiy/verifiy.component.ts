import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';

import { RegisterApiHelper } from '../../RestApiCall/ApiHelper/register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-verifiy',
  templateUrl: './verifiy.component.html',
  styleUrls: ['./verifiy.component.css'],
  animations: [routerTransition()]
})
export class VerifiyComponent implements OnInit {

  id : any;

  constructor( public router : Router, public route: ActivatedRoute, public registerApiHelper : RegisterApiHelper, private toastr: ToastrService) {
    
   }

  ngOnInit() {
  }

  verifiyEmail() {
    this.id = this.route.snapshot.paramMap.get('id');

    let data = {
      id : this.id
    }

    this.registerApiHelper.verifiyEmail(data).subscribe((res : any) => {
      if(res.success){
        this.router.navigate(['']);
      }
    },
      (err) => {
        this.toastr.error(err.error);
      });

  }

}
