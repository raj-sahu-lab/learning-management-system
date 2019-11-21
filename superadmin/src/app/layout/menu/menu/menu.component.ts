import { Component, OnInit } from '@angular/core';

import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';
import { HttpClient } from '@angular/common/http';
import { MenuApiHelper } from '../../../RestApiCall/ApiHelper/menu.service';
import { HelperService } from '../../../RestApiCall/NetworkLayer/helper.service';

@Component({
  selector: 'app-menu',
  providers: [MenuApiHelper],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  menuList = [];
  isEdit = false;
  menuId = null;
  editIndex = null;
  
  title = '';
  description = '';
  navLink = '';
  status = '1';

  constructor(public httpURL: HttpClient,protected serviceMenu: MenuApiHelper, public snotify: TostNotificationService, public helperService: HelperService) { }

  ngOnInit() {
    this.serviceMenu.getMenuList().subscribe((res: ServerResponse) => {
      
      if (res.success && res.data != null) {
        
        this.menuList = res.data;
        this.helperService.loadDataTable();
      }
    },
      (err) => {

        console.log(err);
      });
  }

  deleteButtonClick(index) {

    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete menu?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceMenu.deleteMenu(this.menuList[index].id).subscribe((res: ServerResponse) => {
        
        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {

          this.menuList.splice(index, 1);
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
    
    const menu = this.menuList[index];
    
    this.isEdit = true;
    this.menuId = menu.id;
    this.editIndex = index;
    
    this.title = menu.title;
    this.description = menu.description;
    this.navLink = menu.nav_link;
    this.status = menu.status ? menu.status.toString() : '0';

  }

  cancelEditClick() {

    this.isEdit = false;
    this.editIndex = null;
    this.title = '';
    this.description = '';
    this.navLink = '';
  }

  submitButtonClick() {

    if (this.title == '') {

      this.snotify.body = 'Please enter menu title.';
      this.snotify.onError();

    } else {

      let menuData: { [k: string]: any } = {

        title: this.title,
        description: this.description,
        navLink: this.navLink,
      };

      if (this.isEdit) {

        menuData.menuId = this.menuId;
        menuData.status = this.status;

        this.serviceMenu.updateMenu(menuData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.success && res.data != null && this.editIndex != null) {

            this.menuList[this.editIndex] = res.data;
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

        this.serviceMenu.addMenu(menuData).subscribe((res: ServerResponse) => {

          this.snotify.body = res.message;
          this.snotify.onSuccess();

          if (res.success && res.data != null) {
            
            this.menuList.unshift(res.data);
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
