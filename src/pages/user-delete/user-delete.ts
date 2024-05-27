import { Component } from '@angular/core';
import { Platform, ModalController, IonicPage, NavController, NavParams, ViewController, AlertController, LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { DataProvider } from '../../providers/data/data';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-user-delete',
  templateUrl: 'user-delete.html',
})
export class UserDeletePage {
  unregisterBackButtonAction: any;
  userDetails: any;
  responseData: any;
  studentId: any;
  userImg: any;
  userName: any;
  imgPreview = 'assets/imgs/no_image.png';
  constructor(public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public platform: Platform,
    public storage: Storage,
    public dataService: DataProvider,
    public databaseprovider: DatabaseProvider,
    public viewCtrl: ViewController) {
      if (this.navParams.get('studentId')) {
        this.studentId = this.navParams.get('studentId');
        console.log('studentId', this.studentId);
      } else {
        this.storage.get('userDetails')
          .then((res: any) => {
            if (res) {
              this.userDetails = res;
              console.log(this.userDetails);
            }
          });
      }
      if (this.navParams.get('userImg')) {
        this.userImg = this.navParams.get('userImg');
        console.log('userImg', this.userImg);
      }
      if (this.navParams.get('userName')) {
        this.userName = this.navParams.get('userName');
        console.log('userName', this.userName);
      }
  }

  deleteUser() {
    let studentId = this.studentId ? this.studentId : this.userDetails.studentId;
    this.databaseprovider.deleteUsersById(studentId).then(data => {
      console.log('Users deleted from local db.');
      this.closeModal();
      this.storage.set('userDetails', '');
      this.navCtrl.setRoot("UsersPage");
    }).catch(e => {
      console.log(e);
      this.closeModal();
    });
  }

  closeModal(): void {
    this.viewCtrl.dismiss({ slideAction: 'close' });
  }

  repeatSlide() {
    this.viewCtrl.dismiss({ slideAction: 'repeat' });
  }

  finishSlide() {
    this.viewCtrl.dismiss({ slideAction: 'finish' });
  }

  ionViewDidLoad() {
    this.storage.get('imgPreview')
      .then((res: any) => {
        if (res) {
          this.imgPreview = (this.userImg ? this.userImg : res);
          console.log("Img=>", this.imgPreview);
          let cusid_ele = document.getElementsByClassName('profile-avatar');
          for (let i = 0; i < cusid_ele.length; ++i) {
            let item = cusid_ele[i];
            item.setAttribute("style", "background-image: url(" + (this.userImg ? this.userImg : this.imgPreview) + ");");
          }
        }
      });
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    console.log('HomePage Leave-->');
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(() => {
      console.log('Prevent Back Button Page Change-->');
      this.closeModal();
    });
  }
}
