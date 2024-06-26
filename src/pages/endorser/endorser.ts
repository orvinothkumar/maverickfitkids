import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, AlertController, LoadingController, ViewController } from 'ionic-angular';
import { AppConfig } from '../../config/config';
import { DataProvider } from '../../providers/data/data';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-endorser',
  templateUrl: 'endorser.html',
})
export class EndorserPage {
  unregisterBackButtonAction: any;
  gameContent: any;
  responseData: any;
  userDetails: any;
  imgPreview = 'assets/imgs/no_image.png';
  endroseSelect: boolean = false;
  endroseParentCode: boolean = false;
  endroseFriendsRule: boolean = false;
  endroseSelectParent: boolean = false;
  endroseSelectFriend: boolean = false;
  endrose_friend: any = 'assets/imgs/endorse_friend_grey.png';
  endrose_parent: any = 'assets/imgs/endorse_parent_grey.png';
  constructor(public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public storage: Storage,
    public viewCtrl: ViewController,
    public platform: Platform,
    public dataService: DataProvider) {
    this.storage.get('userDetails')
      .then((res: any) => {
        if (res) {
          this.userDetails = res;
          console.log(this.userDetails);
          let classArr = this.dataService.getClassNumber(this.userDetails.className);
          console.log("className Arr =>> ", classArr);
          if (classArr.indexOf(-3) > -1 ||
          classArr.indexOf(-2) > -1 ||
          classArr.indexOf(-1) > -1 ||
          classArr.indexOf(1) > -1 ||
          classArr.indexOf(2) > -1 ||
          classArr.indexOf(3) > -1 ||
          classArr.indexOf(4) > -1 ||
          classArr.indexOf(5) > -1) {
            this.endroseSelect = false;
            this.endroseParentCode = true;
            this.endroseFriendsRule = false;
          } else {
            this.endroseSelect = true;
            this.endroseParentCode = false;
            this.endroseFriendsRule = false;
            let loader = this.loadingCtrl.create({
              spinner: 'ios',
              content: ''
            });
            loader.present();
            this.dataService.getEndorserOption(this.userDetails).then((result) => {
              loader.dismiss();
              this.responseData = result;
              console.log(this.responseData);
              if (this.responseData.returnStatus != 0) {
                if (this.responseData.challengeApprovedby == "0") {
                  this.endroseSelectParent = true;
                  this.endroseSelectFriend = false;
                  this.endrose_friend = 'assets/imgs/endorse_friend_grey.png';
                  this.endrose_parent = 'assets/imgs/endorse_parent.png';
                } else {
                  this.endroseSelectParent = false;
                  this.endroseSelectFriend = true;
                  this.endrose_friend = 'assets/imgs/endorse_friend.png';
                  this.endrose_parent = 'assets/imgs/endorse_parent_grey.png';
                }
              } else if (this.responseData.returnStatus == 0) {
                console.log('returnStatus=>0');
                const alert = this.alertCtrl.create({
                  message: this.responseData.returnMessage,
                  buttons: [{
                    text: 'Ok',
                    handler: () => { }
                  }],
                  enableBackdropDismiss: false
                });
                alert.present();
              }
            }, (err) => {
              console.log(err);
              loader.dismiss();
              const alert = this.alertCtrl.create({
                message: AppConfig.API_ERROR,
                buttons: [{
                  text: 'Ok',
                  handler: () => { }
                }]
              });
              alert.present();
            });
          }
        }
      });

  }

  selectEndrose(pmValue) {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: ''
    });
    loader.present();
    this.dataService.saveEndorserOption(this.userDetails, pmValue).then((result) => {
      loader.dismiss();
      this.responseData = result;
      console.log(this.responseData);
      if (this.responseData.returnStatus != 0) {

        let classArr = this.dataService.getClassNumber(this.userDetails.className);
        console.log("className Arr =>> ", classArr);
        if (classArr.indexOf(6) > -1 ||
        classArr.indexOf(7) > -1 ||
        classArr.indexOf(8) > -1) {

          if (pmValue == "0") {
            this.endroseSelectParent = true;
            this.endroseSelectFriend = false;
            this.endrose_friend = 'assets/imgs/endorse_friend_grey.png';
            this.endrose_parent = 'assets/imgs/endorse_parent.png';
            this.endroseSelect = false;
            this.endroseParentCode = true;
            this.endroseFriendsRule = false;

          } else {
            this.endroseSelectParent = false;
            this.endroseSelectFriend = true;
            this.endrose_friend = 'assets/imgs/endorse_friend.png';
            this.endrose_parent = 'assets/imgs/endorse_parent_grey.png';
            this.endroseSelect = true;
            this.endroseParentCode = false;
            this.endroseFriendsRule = false;
          }
        }


        if (classArr.indexOf(9) > -1 ||
        classArr.indexOf(10) > -1 ||
        classArr.indexOf(11) > -1 ||
        classArr.indexOf(12) > -1) {
          if (pmValue == "0") {
            this.endroseSelectParent = true;
            this.endroseSelectFriend = false;
            this.endrose_friend = 'assets/imgs/endorse_friend_grey.png';
            this.endrose_parent = 'assets/imgs/endorse_parent.png';
            this.endroseSelect = false;
            this.endroseParentCode = true;
            this.endroseFriendsRule = false;

          } else {
            this.endroseSelectParent = false;
            this.endroseSelectFriend = true;
            this.endrose_friend = 'assets/imgs/endorse_friend.png';
            this.endrose_parent = 'assets/imgs/endorse_parent_grey.png';
            this.endroseSelect = false;
            this.endroseParentCode = false;
            this.endroseFriendsRule = true;
          }
        }

      } else if (this.responseData.returnStatus == 0) {
        console.log('returnStatus=>0');
        const alert = this.alertCtrl.create({
          message: this.responseData.returnMessage,
          buttons: [{
            text: 'Ok',
            handler: () => { }
          }],
          enableBackdropDismiss: false
        });
        alert.present();
      }
    }, (err) => {
      console.log(err);
      loader.dismiss();
      const alert = this.alertCtrl.create({
        message: AppConfig.API_ERROR,
        buttons: [{
          text: 'Ok',
          handler: () => { }
        }]
      });
      alert.present();
    });
  }

  sendTransformCode() {
    let loader = this.loadingCtrl.create({
      spinner: 'ios',
      content: ''
    });
    loader.present();
    this.dataService.sendTransformCode(this.userDetails).then((result) => {
      loader.dismiss();
      this.responseData = result;
      if (this.responseData) {
        const alert = this.alertCtrl.create({
          message: this.responseData.returnMessage,
          buttons: [{
            text: 'Ok',
            handler: () => { }
          }],
          enableBackdropDismiss: false
        });
        alert.present();
      }
    }, (err) => {
      console.log(err);
      loader.dismiss();
      const alert = this.alertCtrl.create({
        message: AppConfig.API_ERROR,
        buttons: [{
          text: 'Ok',
          handler: () => { }
        }]
      });
      alert.present();
    });
  }

  closeModal(): void {
    this.viewCtrl.dismiss({ slideAction: 'close' });
  }

  ionViewDidLoad() {
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    console.log('ionicPage Leave-->');
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      console.log('Prevent Back Button Page Change-->');
      this.closeModal();
    });
  }
}
