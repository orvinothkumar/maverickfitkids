import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  Platform,
  ModalController,
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
} from "ionic-angular";
import { Storage } from "@ionic/storage";
import { AppConfig } from "../../config/config";
import { DataProvider } from "../../providers/data/data";
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: "page-guide-exercise",
  templateUrl: "guide-exercise.html",
})
export class GuideExercisePage {
  unregisterBackButtonAction: any;
  slides: any = null;
  currentSlide: any = 0;
  imgPreview = "assets/imgs/no_image.png";
  isPlaying: boolean = false;
  isSpeaking: boolean = false;
  showVideoTag: boolean = true;
  responseData: any;
  userDetails: any;
  exerciseType: any = "";
  exerciseLists: any = [];
  exerciseList: any = {
    insAudioPath: "",
    audioPath: "",
    exercisePath: "",
    imageVideoName: "",
    exerciseDescription: "",
    workoutId: "",
  };
  @ViewChild("video") video: ElementRef;
  private myVideo: HTMLVideoElement;
  @ViewChild('musicaudio') musicaudio: ElementRef;
  private musicAudio: HTMLAudioElement;
  userList: any;
  isPlaying1: boolean = false;
  music_icon: any = 'assets/imgs/music_icon_gray.png';
  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public storage: Storage,
    public platform: Platform,
    public databaseprovider: DatabaseProvider,
    public dataService: DataProvider
  ) {
    this.storage.get("userDetails").then((res: any) => {
      if (res) {
        this.userDetails = res;
        console.log("userDetails",this.userDetails);
        this.checkuserMusic();
      }
    });
  }

  async checkuserMusic() {
    this.userList = await this.databaseprovider.selectUserById(this.userDetails.studentId).then(res => res);
    if (this.userList) {
      if (this.userList[0].playlist) {
        this.musicAudio = this.musicaudio.nativeElement;
        this.musicAudio.src = this.userList[0].playlist;
        this.music_icon = 'assets/imgs/music_icon_play.png';
      } else {
        this.music_icon = 'assets/imgs/music_icon_gray.png';
      }
    }
  }

  toggleAudio() {
    if (this.isPlaying1) {
      this.stopAudio();
    } else {
      this.startAudio();
    }
    console.log("isPlaying", this.isPlaying1);
  }

  startAudio() {
    this.isPlaying1 = true;
    this.musicAudio.play();
    this.music_icon = 'assets/imgs/music_icon_pause.png';
  }

  stopAudio() {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
    }
    this.isPlaying1 = false;
    this.music_icon = 'assets/imgs/music_icon_play.png';
  }

  videoPlay() {
    if (this.exerciseLists.length > 0) {
      let isVideoPlaying =
        this.myVideo.currentTime > 0 &&
        !this.myVideo.paused &&
        !this.myVideo.ended &&
        this.myVideo.readyState > 2;
      console.log("isVideoPlaying", isVideoPlaying);
      if (!isVideoPlaying) {
        this.myVideo.play();
      }
    }
  }

  videoPause() {
    if (this.exerciseLists.length > 0) {
      let isVideoPlaying =
        this.myVideo.currentTime > 0 &&
        !this.myVideo.paused &&
        !this.myVideo.ended &&
        this.myVideo.readyState > 2;
      console.log("isVideoPlaying", isVideoPlaying);
      if (isVideoPlaying) {
        this.myVideo.pause();
      }
    }
  }

  toggleVideo() {
    if (this.exerciseLists.length > 0) {
      console.log("Paused==>" + this.myVideo.paused);
    }
  }

  ionViewDidLoad() {
    this.storage.get("imgPreview").then((res: any) => {
      if (res) {
        this.imgPreview = res;
        console.log("Img=>", this.imgPreview);
        let cusid_ele = document.getElementsByClassName("profile-avatar");
        for (let i = 0; i < cusid_ele.length; ++i) {
          let item = cusid_ele[i];
          item.setAttribute(
            "style",
            "background-image: url(" + this.imgPreview + ");"
          );
        }
      }
    });
    this.slides = document.querySelectorAll<HTMLElement>("#slides .slider");
    var videos = document.getElementById("videos");
    videos.addEventListener("play", () => {}, false);
    videos.addEventListener("pause", () => {}, false);
    this.exerciseLists = this.navParams.get("guideList");
    this.exerciseType = this.navParams.get("exerciseType");
    console.log(this.exerciseLists);
    if (this.exerciseLists) {
      // if (this.exerciseLists.length > 1) {
      //   let previousIcon = document.getElementsByClassName("previousIcon");
      //   for (let i = 0; i < previousIcon.length; ++i) {
      //     let item = previousIcon[i];
      //     item.setAttribute("style", "opacity:0.3;");
      //   }
      //   let nextIcon = document.getElementsByClassName("nextIcon");
      //   for (let i = 0; i < nextIcon.length; ++i) {
      //     let item = nextIcon[i];
      //     item.setAttribute("style", "opacity:1;");
      //   }
      // } else {
        let previousIcon = document.getElementsByClassName("previousIcon");
        for (let i = 0; i < previousIcon.length; ++i) {
          let item = previousIcon[i];
          item.setAttribute("style", "opacity:0.3;");
        }
        let nextIcon = document.getElementsByClassName("nextIcon");
        for (let i = 0; i < nextIcon.length; ++i) {
          let item = nextIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
      // }
      if (this.exerciseLists[0].fileType == "2") {
        if (
          this.exerciseLists[0].step1Path != null ||
          this.exerciseLists[0].step1Path != ""
        ) {
          this.exerciseList.exercisePath =
            this.exerciseLists[0].step1Path.replace(
              "/maverick/Directory/Video/",
              AppConfig.SITE_URL + "maverick/Directory/Video/"
            );
        } else {
          this.exerciseList.exercisePath = "";
        }
        this.myVideo = this.video.nativeElement;
        this.myVideo.src = this.exerciseList.exercisePath;
        this.showVideoTag = true;
        let cusid_ele = document.getElementsByClassName("excercise-video");
        for (let i = 0; i < cusid_ele.length; ++i) {
          let item = cusid_ele[i];
          item.setAttribute("style", "visibility:visible;");
        }
      } else {
        if (
          this.exerciseLists[0].step1Path != null ||
          this.exerciseLists[0].step1Path != ""
        ) {
          this.exerciseList.exercisePath =
            this.exerciseLists[0].step1Path.replace(
              "/maverick/Directory/Image/",
              AppConfig.SITE_URL + "maverick/Directory/Image/"
            );
        } else {
          this.exerciseList.exercisePath = "";
        }
        this.showVideoTag = false;
        this.myVideo = this.video.nativeElement;
        this.myVideo.src = this.exerciseList.exercisePath;
        let cusid_ele = document.getElementsByClassName("excercise-video");
        for (let i = 0; i < cusid_ele.length; ++i) {
          let item = cusid_ele[i];
          item.setAttribute("style", "visibility:hidden;height:0;");
        }
      }
      this.exerciseList.imageVideoName = this.exerciseLists[0].imageVideoName;
      if (
        this.exerciseLists[0].description != null &&
        this.exerciseLists[0].description != ""
      ) {
        this.exerciseList.exerciseDescription =
          this.exerciseLists[0].description.replace(/(?:\r\n|\r|\n)/g, "<br>");
      } else {
        this.exerciseList.exerciseDescription = "";
      }
      this.exerciseList.workoutId = this.exerciseLists[0].workoutId;
      this.videoPlay();
    }
    this.initializeBackButtonCustomHandler();
  }

  ionViewWillLeave() {
    console.log("HomePage Leave-->");
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
  }

  initializeBackButtonCustomHandler(): void {
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(
      () => {
        console.log("Prevent Back Button Page Change-->");
        this.goHome();
      }
    );
  }

  nextSlide() {
    if (this.exerciseLists.length > 0) {
      console.log(this.currentSlide + 1 + " == " + this.exerciseLists.length);
      if (
        this.currentSlide + 1 == this.exerciseLists.length
      ) {
        let nextIcon = document.getElementsByClassName("nextIcon");
        for (let i = 0; i < nextIcon.length; ++i) {
          let item = nextIcon[i];
          item.setAttribute("style", "opacity:0.3;");
        }
        let previousIcon = document.getElementsByClassName("previousIcon");
        for (let i = 0; i < previousIcon.length; ++i) {
          let item = previousIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
      } else {
        let nextIcon = document.getElementsByClassName("nextIcon");
        for (let i = 0; i < nextIcon.length; ++i) {
          let item = nextIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
        let previousIcon = document.getElementsByClassName("previousIcon");
        for (let i = 0; i < previousIcon.length; ++i) {
          let item = previousIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
      }
      if (this.currentSlide + 1 == this.exerciseLists.length) {
        //this.currentSlide = 0;
        this.storage.get("userDetails").then((res: any) => {
          if (res) {
            let classArr = this.dataService.getClassNumber(res.className);
            console.log("className Arr =>> ", classArr);
            if (classArr.indexOf(9) > -1 ||
            classArr.indexOf(10) > -1 ||
            classArr.indexOf(11) > -1 ||
            classArr.indexOf(12) > -1
            ) {
              console.log("last slide");
              this.openModal("ExercisePopupPage");
            } else {
              this.openModal("ExercisePopupPage");
            }
          }
        });
      } else {
        console.log("Curr", this.currentSlide + 1);
        if (this.exerciseLists[this.currentSlide + 1].fileType == "2") {
          if (
            this.exerciseLists[this.currentSlide + 1].step1Path != null &&
            this.exerciseLists[this.currentSlide + 1].step1Path != ""
          ) {
            this.exerciseList.exercisePath = this.exerciseLists[
              this.currentSlide + 1
            ].step1Path.replace(
              "/maverick/Directory/Video/",
              AppConfig.SITE_URL + "maverick/Directory/Video/"
            );
          } else {
            this.exerciseList.exercisePath = "";
          }
          this.myVideo = this.video.nativeElement;
          this.myVideo.src = this.exerciseList.exercisePath;
          this.showVideoTag = true;
          let cusid_ele = document.getElementsByClassName("excercise-video");
          for (let i = 0; i < cusid_ele.length; ++i) {
            let item = cusid_ele[i];
            item.setAttribute("style", "visibility:visible;");
          }
        } else {
          if (
            this.exerciseLists[this.currentSlide + 1].step1Path != null ||
            this.exerciseLists[this.currentSlide + 1].step1Path != ""
          ) {
            this.exerciseList.exercisePath = this.exerciseLists[
              this.currentSlide + 1
            ].step1Path.replace(
              "/maverick/Directory/Image/",
              AppConfig.SITE_URL + "maverick/Directory/Image/"
            );
          } else {
            this.exerciseList.exercisePath = "";
          }
          this.showVideoTag = false;
          this.myVideo = this.video.nativeElement;
          this.myVideo.src = this.exerciseList.exercisePath;
          let cusid_ele = document.getElementsByClassName("excercise-video");
          for (let i = 0; i < cusid_ele.length; ++i) {
            let item = cusid_ele[i];
            item.setAttribute("style", "visibility:hidden;height:0;");
          }
        }
        this.exerciseList.imageVideoName =
          this.exerciseLists[this.currentSlide + 1].imageVideoName;
        console.log(
          "desc=>",
          this.exerciseLists[this.currentSlide + 1].description
        );
        if (
          this.exerciseLists[this.currentSlide + 1].description != null &&
          this.exerciseLists[this.currentSlide + 1].description != ""
        ) {
          this.exerciseList.exerciseDescription = this.exerciseLists[
            this.currentSlide + 1
          ].description.replace(/(?:\r\n|\r|\n)/g, "<br>");
        } else {
          this.exerciseList.exerciseDescription = "";
        }
        this.exerciseList.workoutId =
          this.exerciseLists[this.currentSlide + 1].workoutId;
        this.goToSlide(this.currentSlide + 1);
        this.videoPlay();
      }
    }
  }

  prevSlide() {
    if (this.exerciseLists.length > 0) {
      console.log(this.currentSlide - 1 + " == " + this.exerciseLists.length);
      if (this.currentSlide == 0 || this.currentSlide == 1) {
        let previousIcon = document.getElementsByClassName("previousIcon");
        for (let i = 0; i < previousIcon.length; ++i) {
          let item = previousIcon[i];
          item.setAttribute("style", "opacity:0.3;");
        }
        let nextIcon = document.getElementsByClassName("nextIcon");
        for (let i = 0; i < nextIcon.length; ++i) {
          let item = nextIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
      } else {
        let previousIcon = document.getElementsByClassName("previousIcon");
        for (let i = 0; i < previousIcon.length; ++i) {
          let item = previousIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
        let nextIcon = document.getElementsByClassName("nextIcon");
        for (let i = 0; i < nextIcon.length; ++i) {
          let item = nextIcon[i];
          item.setAttribute("style", "opacity:1;");
        }
      }
      if (this.currentSlide == 0) {
        console.log("Home Slide");
      } else {
        console.log("Curr", this.currentSlide - 1);
        if (this.exerciseLists[this.currentSlide - 1].fileType == "2") {
          if (
            this.exerciseLists[this.currentSlide - 1].step1Path != null &&
            this.exerciseLists[this.currentSlide - 1].step1Path != ""
          ) {
            this.exerciseList.exercisePath = this.exerciseLists[
              this.currentSlide - 1
            ].step1Path.replace(
              "/maverick/Directory/Video/",
              AppConfig.SITE_URL + "maverick/Directory/Video/"
            );
          } else {
            this.exerciseList.exercisePath = "";
          }
          this.myVideo = this.video.nativeElement;
          this.myVideo.src = this.exerciseList.exercisePath;
          this.showVideoTag = true;
          let cusid_ele = document.getElementsByClassName("excercise-video");
          for (let i = 0; i < cusid_ele.length; ++i) {
            let item = cusid_ele[i];
            item.setAttribute("style", "visibility:visible;");
          }
        } else {
          if (
            this.exerciseLists[this.currentSlide - 1].step1Path != null ||
            this.exerciseLists[this.currentSlide - 1].step1Path != ""
          ) {
            this.exerciseList.exercisePath = this.exerciseLists[
              this.currentSlide - 1
            ].step1Path.replace(
              "/maverick/Directory/Image/",
              AppConfig.SITE_URL + "maverick/Directory/Image/"
            );
          } else {
            this.exerciseList.exercisePath = "";
          }
          this.showVideoTag = false;
          this.myVideo = this.video.nativeElement;
          this.myVideo.src = this.exerciseList.exercisePath;
          let cusid_ele = document.getElementsByClassName("excercise-video");
          for (let i = 0; i < cusid_ele.length; ++i) {
            let item = cusid_ele[i];
            item.setAttribute("style", "visibility:hidden;height:0;");
          }
        }
        this.exerciseList.imageVideoName =
          this.exerciseLists[this.currentSlide - 1].imageVideoName;
        if (
          this.exerciseLists[this.currentSlide - 1].description != null &&
          this.exerciseLists[this.currentSlide - 1].description != ""
        ) {
          this.exerciseList.exerciseDescription = this.exerciseLists[
            this.currentSlide - 1
          ].description.replace(/(?:\r\n|\r|\n)/g, "<br>");
        } else {
          this.exerciseList.exerciseDescription = "";
        }
        this.exerciseList.workoutId =
          this.exerciseLists[this.currentSlide - 1].workoutId;
        this.goToSlide(this.currentSlide - 1);
        this.videoPlay();
      }
    }
  }

  goToSlide(n) {
    if (this.exerciseLists.length > 0) {
      this.currentSlide =
        (n + this.exerciseLists.length) % this.exerciseLists.length;
    }
  }

  openModal(pageName) {
    if (this.exerciseLists.length > 0) {
      this.videoPause();
      let modal = this.modalCtrl.create(pageName, null, {
        cssClass: "exercise-modal",
        enableBackdropDismiss: false,
      });
      modal.present();
      modal.onDidDismiss((data) => {
        if (data.slideAction == "finish") {
          // if (this.navCtrl.canGoBack()) {
          //   this.navCtrl.pop();
          // } else {
          this.dataService.markStarForStudent(this.userDetails, 12).then(
            (result) => {
              this.responseData = result;
              console.log(this.responseData.starList);
              if (this.responseData.returnStatus != 0) {
                this.navCtrl.setRoot("StarRatingPage", {
                  starList: this.responseData.starList,
                });
              } else if (this.responseData.returnStatus == 0) {
                console.log("returnStatus=>0");
                const alert = this.alertCtrl.create({
                  message: this.responseData.returnMessage,
                  buttons: [
                    {
                      text: "Ok",
                      handler: () => {
                        //this.navCtrl.pop();
                      },
                    },
                  ],
                  enableBackdropDismiss: false,
                });
                alert.present();
              }
            },
            (err) => {
              console.log(err);
              const alert = this.alertCtrl.create({
                message: AppConfig.API_ERROR,
                buttons: [
                  {
                    text: "Ok",
                    handler: () => {},
                  },
                ],
              });
              alert.present();
            }
          );
          // }
        } else if (data.slideAction == "repeat") {
          this.initializeBackButtonCustomHandler();
          if (this.exerciseLists[0].fileType == "2") {
            if (
              this.exerciseLists[0].step1Path != null ||
              this.exerciseLists[0].step1Path != ""
            ) {
              this.exerciseList.exercisePath =
                this.exerciseLists[0].step1Path.replace(
                  "/maverick/Directory/Video/",
                  AppConfig.SITE_URL + "maverick/Directory/Video/"
                );
            } else {
              this.exerciseList.exercisePath = "";
            }
            this.myVideo = this.video.nativeElement;
            this.myVideo.src = this.exerciseList.exercisePath;
            this.showVideoTag = true;
            let cusid_ele = document.getElementsByClassName("excercise-video");
            for (let i = 0; i < cusid_ele.length; ++i) {
              let item = cusid_ele[i];
              item.setAttribute("style", "visibility:visible;");
            }
          } else {
            if (
              this.exerciseLists[0].step1Path != null ||
              this.exerciseLists[0].step1Path != ""
            ) {
              this.exerciseList.exercisePath =
                this.exerciseLists[0].step1Path.replace(
                  "/maverick/Directory/Image/",
                  AppConfig.SITE_URL + "maverick/Directory/Image/"
                );
            } else {
              this.exerciseList.exercisePath = "";
            }
            this.showVideoTag = false;
            this.myVideo = this.video.nativeElement;
            this.myVideo.src = this.exerciseList.exercisePath;
            let cusid_ele = document.getElementsByClassName("excercise-video");
            for (let i = 0; i < cusid_ele.length; ++i) {
              let item = cusid_ele[i];
              item.setAttribute("style", "visibility:hidden;height:0;");
            }
          }
          this.exerciseList.imageVideoName =
            this.exerciseLists[0].imageVideoName;
          if (
            this.exerciseLists[0].description != null &&
            this.exerciseLists[0].description != ""
          ) {
            this.exerciseList.exerciseDescription =
              this.exerciseLists[0].description.replace(
                /(?:\r\n|\r|\n)/g,
                "<br>"
              );
          } else {
            this.exerciseList.exerciseDescription = "";
          }
          this.exerciseList.workoutId = this.exerciseLists[0].workoutId;
          this.goToSlide(this.currentSlide + 1);
          this.videoPlay();
        } else if (data.slideAction == "close") {
          console.log("Close");
        }
      });
    }
  }
  goHome() {
    if (this.exerciseLists.length > 0) {
      this.videoPause();
    }
    if(this.exerciseType == 'weekly-workout'){
      this.navCtrl.setRoot("MenuPage");
    } else {
      this.navCtrl.setRoot("GuidesPage");
    }
  }

  goPage(pmPage) {
    if (this.exerciseLists.length > 0) {
      this.videoPause();
    }
    this.navCtrl.setRoot(pmPage);
  }

  showAbout() {
    this.openModal("AboutGuidePopupPage");
  }

  playMusic() {
    console.log("playMusic clicked");
    this.toggleAudio();
  }
}
