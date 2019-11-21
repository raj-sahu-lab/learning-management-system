import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    status: boolean = false;
    
    public account_title: string;
    public picture: string;
    public role: number;

    constructor(private translate: TranslateService, public router: Router) {}

    ngOnInit() {

        const user = JSON.parse(localStorage.getItem('User'));
                
        this.account_title = user.title;
        this.picture = user.image;
        this.role = user.role;

    }

    dropdown() {

        this.status = !this.status;
        
    }

    // isToggled(): boolean {
    //     const dom: Element = document.querySelector('body');
    //     return dom.classList.contains(this.pushRightClass);
    // }

    // toggleSidebar() {
    //     const dom: any = document.querySelector('body');
    //     dom.classList.toggle(this.pushRightClass);
    // }

    // rltAndLtr() {
    //     const dom: any = document.querySelector('body');
    //     dom.classList.toggle('rtl');
    // }

    onLoggedout() {

        localStorage.removeItem('isLoggedin');
        this.router.navigate(['/login']);
    }

    // changeLang(language: string) {
    //     this.translate.use(language);
    // }
}
