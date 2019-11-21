import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TostNotificationService } from '../../../RestApiCall/NetworkLayer/toast-notification.service';

import { ForumApiHelper } from '../../../RestApiCall/ApiHelper/Forum.service';
import { ServerResponse } from '../../../RestApiCall/NetworkLayer/model.interface'; 
import { MessagingService } from '../../../shared/messaging.service';

@Component({
  selector: 'app-forum-discussion',
  providers: [ForumApiHelper],
  templateUrl: './forum-discussion.component.html',
  styleUrls: ['./forum-discussion.component.scss']
})
export class ForumDiscussionComponent implements OnInit {

  articleid = undefined;
  articleDiscussion : any;
  
  constructor(public router: Router, private route: ActivatedRoute, protected serviceForum: ForumApiHelper, public snotify: TostNotificationService, public messagingService : MessagingService) {
    
    this.articleid = this.route.snapshot.paramMap.get('id');
    
  }

  ngOnInit(): void {

    this.discussionHistory();
  }

  discussionHistory() {

    const articleData: {[k: string]: any} = {
      articleid: this.articleid
    };

    this.serviceForum.showDiscussion(articleData).subscribe((res: ServerResponse) => {

      if (res.success && res.data != null) {
      
        this.articleDiscussion = res.data;
        
      }
    },
    (err) => {

      this.snotify.body = err.error;
      this.snotify.onError();
    });

  }

  deleteButtonClick(messageId) {
    
    this.snotify.timeout = 6000;
    this.snotify.body = 'Are you sure you want to delete message?';
    this.snotify.bodyMaxLength = 200;
    this.snotify.onConfirmation();
    this.snotify.confirmBox.subscribe((yesClick) => {

      this.serviceForum.deleteReplyMessage(messageId).subscribe((res: ServerResponse) => {

        this.snotify.body = res.message;
        this.snotify.onSuccess();

        if (res.success) {
          this.discussionHistory();
          //this.articleDiscussion.splice(this.articleDiscussion.findIndex(obj => obj.id == messageId), 1);

        }
      }, (err) => {

        console.log(err);
      });

    }, (no) => {
      console.log('NO');
    });

   
  }

}
