import { Injectable } from '@angular/core';
import { Subject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedirectionService {

  constructor() { }

  // TOPIC REDIRECTION EMITTER
  private _dashBoardToTopic = new Subject<any>();

  getDashBoardToTopic(): Observable<any> {
    return this._dashBoardToTopic.asObservable();
  }

  sendDashBoardToTopic(id: any) {
    this._dashBoardToTopic.next(id);
  }

  //SUBJECT REDIRECTION EMIITER
  private _dashBoardToSub = new Subject<any>();

  getDashBoardToSub(): Observable<any> {
    return this._dashBoardToSub.asObservable();
  }

  sendDashBoardToSub(id: any) {
    this._dashBoardToSub.next(id);
  }

  //CONTENT REDIRECTION EMIITER
  private _content = new Subject<any>();

  getContentUrl(): Observable<any> {
    return this._content.asObservable();
  }

  sendContentUrl(id: any) {
    this._content.next(id);
  }

  //CONTENT-DETAILS REDIRECTION EMIITER
  private _contentDetails = new Subject<any>();

  getContentDetailsUrl(): Observable<any> {
    return this._contentDetails.asObservable();
  }

  sendContentDetailsUrl(id: any) {
    this._contentDetails.next(id);
  }

  //TEST REDIRECTION EMIITER
  private _test = new Subject<any>();

  getTestUrl(): Observable<any> {
    return this._test.asObservable();
  }

  sendTestUrl(id: any) {
    this._test.next(id);
  }

  //TEST RESULT REDIRECTION EMIITER
  private _testResult = new Subject<any>();

  getTestResultUrl(): Observable<any> {
    return this._testResult.asObservable();
  }

  sendTestResultUrl(id: any) {
    this._testResult.next(id);
  }

  //POLL REDIRECTION EMIITER
  private _polls = new Subject<any>();

  getPollUrl(): Observable<any> {
    return this._polls.asObservable();
  }

  sendPollUrl(id: any) {
    this._polls.next(id);
  }

  //PRACTICE TEST REDIRECTION EMIITER
  private _practiceTest = new Subject<any>();

  getPracticeTestUrl(): Observable<any> {
    return this._practiceTest.asObservable();
  }

  sendPracticetestUrl(id: any) {
    this._practiceTest.next(id);
  }

  //FORUM CATEGORY REDIRECTION EMIITER
  private _forumCat = new Subject<any>();

  getForumCatUrl(): Observable<any> {
    return this._forumCat.asObservable();
  }

  sendForumCatUrl(id: any) {
    this._forumCat.next(id);
  }

  //FORUM SUBJECT REDIRECTION EMIITER
  private _forumSub = new Subject<any>();

  getForumSubUrl(): Observable<any> {
    return this._forumSub.asObservable();
  }

  sendForumSubUrl(id: any) {
    this._forumSub.next(id);
  }

  //FORUM ARTICLE REDIRECTION EMIITER
  private _forumArt = new Subject<any>();

  getForumArtUrl(): Observable<any> {
    return this._forumArt.asObservable();
  }

  sendForumArtUrl(id: any) {
    this._forumArt.next(id);
  }

  //FORUM TOPIC REDIRECTION EMIITER
  private _forumTop = new Subject<any>();

  getForumTopUrl(): Observable<any> {
    return this._forumTop.asObservable();
  }

  sendForumTopUrl(id: any) {
    this._forumTop.next(id);
  }

  //SUPPORT REQUEST REDIRECTION EMIITER
  private _supportRequest = new Subject<any>();

  getSupportRequestUrl(): Observable<any> {
    return this._supportRequest.asObservable();
  }

  sendSupportRequestUrl(id: any) {
    this._supportRequest.next(id);
  }

  //LIVE CLASS REDIRECTION EMIITER
  private _liveClass = new Subject<any>();

  getLiveClassUrl(): Observable<any> {
    return this._liveClass.asObservable();
  }

  sendLiveClassUrl(id: any) {
    this._liveClass.next(id);
  }
}
