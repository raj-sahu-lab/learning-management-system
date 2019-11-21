import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Router } from '@angular/router';
import { BaseService } from '../../RestApiCall/NetworkLayer/base.service';

@Injectable()
export class AuthGuard implements CanActivate {

    loggedIn : any;
    constructor(protected baseService: BaseService,private router: Router) {}

    canActivate() {
        
        if (localStorage.getItem('isLoggedin')) {
            return true;
        }

        this.router.navigate(['/login']);
        return false;        
    }
}
