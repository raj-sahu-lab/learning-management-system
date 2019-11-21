import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk/global';
import * as S3 from 'aws-sdk/clients/s3';

import { environment } from '../../environments/environment';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AWSUploadService {

  loggedIn : any;
  constructor() { }

  //to pass loading % to component
  private _invokeProgress = new Subject<any>();

  getProgress(): Observable<any> {
    return this._invokeProgress.asObservable();
  }

  sendProgress(progress: any) {
    this._invokeProgress.next(progress);
  }
  //end pass loading % to component

  uploadAudioFile(file) {
    
    const User = JSON.parse(localStorage.getItem('User'));

    const contentType = file.type;
    let audioName = file.name;

    audioName = audioName.replace(/\s+/g, '_');
    const fileKey = User.account_id + '/files/' + (new Date().getTime().toString()) + '_' + 'TOA_Audio_' + audioName;

    const bucket = new S3({
      accessKeyId: environment.aws.accessKeyId,
      secretAccessKey: environment.aws.secretAccessKey,
      region: environment.aws.region
    });
    const params = {
      Bucket: environment.aws.bucket,
      Key: fileKey,
      Body: file,
      ContentType: contentType
    };

    return bucket.upload(params).promise();
    }

  uploadVideoFile(file) {
    
    const User = JSON.parse(localStorage.getItem('User'));
    const contentType = file.type;
    let videoName = file.name;

    videoName = videoName.replace(/\s+/g, '_');
    const fileKey = User.account_id + '/files/' + (new Date().getTime().toString()) + '_' + 'TOA_Video_' + videoName;

    // const options = {queueSize: 1};
    // AWS.config.httpOptions.timeout = 0;
    const options = {partSize: (10 * 1024 * 1024), queueSize: 1};

    const s3 = new S3({
      // accessKeyId: environment.aws.accessKeyId,
      // secretAccessKey: environment.aws.secretAccessKey,
      region: environment.aws.region
    });
    const params = {
      Bucket: environment.aws.bucket,
      Key: fileKey,
      Body: file,
      ContentType: contentType
    };

    // return bucket.upload(params, options).on('httpUploadProgress' , progress => {
    //   return progress;
    //   }
    //   ).promise();

    return s3.upload(params, options).on('httpUploadProgress' , progress =>{
      // console.log(progress)
      const percentage = this.convetToPercentage(progress.loaded, progress.total);
      this.sendProgress(percentage);
    }).promise(); // , options
  }

  convetToPercentage(num, den){
    return Math.ceil((num * 100)/den);
  }
}
