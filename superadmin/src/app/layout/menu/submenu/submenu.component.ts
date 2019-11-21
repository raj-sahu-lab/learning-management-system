import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';
import { MenuApiHelper } from '../../../RestApiCall/ApiHelper/menu.service';
import { SubMenuApiHelper } from '../../../RestApiCall/ApiHelper/submenu.service';
import { log } from 'util';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-submenu',
  templateUrl: './submenu.component.html',
  styleUrls: ['./submenu.component.scss']
})
export class SubmenuComponent implements OnInit {

  submenuList = [];
  isEdit = false;
  subMenuId = null;
  editIndex = null;
  
  menuList = [];
  menuId = undefined;
  title = '';
  description = '';
  navLink = '';
  status = '1';

  constructor(public httpURL: HttpClient,protected serviceMenu: MenuApiHelper,protected serviceSubMenu: SubMenuApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {

    this.menu();
    this.submenu();
  }

  menu() {

    this.serviceMenu.getMenuList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.menuList = res.data;
        
      }
    },
      (err) => {

        console.log(err);
      });
  }

  submenu() {

    this.serviceSubMenu.getSubMenuList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.submenuList = res.data; 
        this.helperService.loadDataTable();       
      }
    },
      (err) => {

        console.log(err);
      });
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete sub menu?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceSubMenu.deleteSubMenu(this.submenuList[index].id).subscribe((res: ServerResponse) => {
        
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.submenuList.splice(index, 1);
          this.helperService.loadDataTable();       
          this.cancelEditClick();
          
        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log("NO");
    });
  }

  editButtonClick(index) {
    
    const submenu = this.submenuList[index];
    
    this.isEdit = true;
    this.subMenuId = submenu.id;
    this.editIndex = index;
    
    this.menuId = submenu.menu.id;
    this.title = submenu.title;
    this.description = submenu.description;
    this.navLink = submenu.nav_link;
    this.status = submenu.status ? submenu.status.toString() : '0';

  }

  cancelEditClick() {

    this.isEdit = false;
    this.editIndex = null;

    this.menuId = undefined;
    this.title = '';
    this.description = '';
    this.navLink = '';
  }

  submitButtonClick() {

    if (this.menuId == undefined) {

      this.snotify.body = 'Please select menu.';
      this.snotify.onError();

    } else if (this.title == '') {

      this.snotify.body = 'Please enter sub menu title.';
      this.snotify.onError();

    } else {

      let submenuData: { [k: string]: any } = {

        menuId: this.menuId,
        title: this.title,
        description: this.description,
        navLink: this.navLink,
      };

      if (this.isEdit) {
        
        submenuData.subMenuId = this.subMenuId;
        submenuData.status = this.status;

        this.serviceSubMenu.updateSubMenu(submenuData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.submenuList[this.editIndex] = res.data;
            this.helperService.loadDataTable();       
            this.cancelEditClick();
            
          }
        },
          (err) => {

            this.snotify.body = err.error;
            this.snotify.onError();

            console.log(err);

          });
      } else {

        this.serviceSubMenu.addSubMenu(submenuData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {
            
            this.submenuList.unshift(res.data);
            this.helperService.loadDataTable();       
            this.cancelEditClick();
          }
        },
          (err) => {
            this.snotify.body = err.message;
            this.snotify.onError();
          });
      }
    }
  }

}
