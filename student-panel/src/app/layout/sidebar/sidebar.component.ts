import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;
    displayNavigation : boolean = false;
    private subscription: Subscription;

    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor( public router: Router) {
        
        this.subscription = this.router.events.subscribe(val => {
            this.displayNavigation = false;
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });
    }

    ngOnInit() {
        
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';
        this.displayNavigation = false;
    }


    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

   
    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }

    navigateUrl(path : any){
        this.router.navigate(['/student/'+path]);
    }

    aboutInstitute(){
        if(this.displayNavigation){
            this.displayNavigation = false;
        } else this.displayNavigation = true;
    }

    ngOnDestroy(){
        if(this.subscription){
          this.subscription.unsubscribe();
        }
    }
}
