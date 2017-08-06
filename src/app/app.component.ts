import {Component, Inject, OnInit} from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import {AiTalk} from './model/ai-talk';
import {MD_DIALOG_DATA, MdDialog, MdDialogRef} from "@angular/material";
import {GenderType} from "./model/gender-type";
import {ExpressionType} from "./model/expression-type";
import {JudgedType} from "./model/judged-type";
import {DialogData} from "./model/dialog-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  chatFlag = false;

  // Talk Text
  carrotText: string;
  onionText: string;
  tomatoText: string;
  pumpkinText: string;
  eggplantText: string;
  bellPepperText: string;

  // Web Audio API
  audioContext: AudioContext;

  // Boy
  audioBufferBoyFun: AudioBuffer;
  audioBufferBoyNormal: AudioBuffer;
  audioBufferBoyPain: AudioBuffer;
  audioBufferBoySad: AudioBuffer;
  audioBufferBoyPorkerFaced: AudioBuffer;
  audioBufferBoyOops: AudioBuffer;

  // Girl
  audioBufferGirlFun: AudioBuffer;
  audioBufferGirlNormal: AudioBuffer;
  audioBufferGirlPain: AudioBuffer;
  audioBufferGirlSad: AudioBuffer;
  audioBufferGirlPorkerFaced: AudioBuffer;
  audioBufferGirlOops: AudioBuffer;


  aiTalkWebApiUrl = 'http://localhost:8888/aitalk.php';

  selectedGenderType: GenderType;

  currentTemperature: JudgedType;
  currentSolarRadiation: JudgedType;
  currentHumidity: JudgedType;
  currentExpressionType: ExpressionType;

  min = -1;
  max = 1;

  tomatomImgUrl = `assets/img/${this.selectedGenderType}-${this.currentExpressionType}.png`;
  dialogFlag = false;

  topUrl = 'assets/img/girl-normal.png';

  constructor(private http: Http, public dialog: MdDialog) { }

  ngOnInit() {
    // Audio
    this.audioContext = new AudioContext();
    this.fetchAll();

    this.onChangeWether();
  }

  /**
   * すべての音源をFetch
   */
  fetchAll() {
    this.fetch(GenderType.BOY, ExpressionType.FUN).then(audioBuffer => this.audioBufferBoyFun = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.BOY, ExpressionType.NORMAL).then(audioBuffer => this.audioBufferBoyNormal = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.BOY, ExpressionType.PAIN).then(audioBuffer => this.audioBufferBoyPain = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.BOY, ExpressionType.SAD).then(audioBuffer => this.audioBufferBoySad = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.BOY, ExpressionType.PORKER_FACED).then(audioBuffer => this.audioBufferBoyPorkerFaced = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.BOY, ExpressionType.OOPS).then(audioBuffer => this.audioBufferBoyOops = audioBuffer).catch(error => {throw error});

    this.fetch(GenderType.GIRL, ExpressionType.FUN).then(audioBuffer => this.audioBufferGirlFun = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.GIRL, ExpressionType.NORMAL).then(audioBuffer => this.audioBufferGirlNormal = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.GIRL, ExpressionType.PAIN).then(audioBuffer => this.audioBufferGirlPain = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.GIRL, ExpressionType.SAD).then(audioBuffer => this.audioBufferGirlSad = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.GIRL, ExpressionType.PORKER_FACED).then(audioBuffer => this.audioBufferGirlPorkerFaced = audioBuffer).catch(error => {throw error});
    this.fetch(GenderType.GIRL, ExpressionType.OOPS).then(audioBuffer => this.audioBufferGirlOops = audioBuffer).catch(error => {throw error});
  }

  /**
   * 音源をFetch
   * @param {GenderType} genderType
   * @param {ExpressionType} expressionType
   * @returns {Promise<any>}
   */
  fetch(genderType: GenderType, expressionType: ExpressionType): Promise<any> {
    return fetch(`assets/audio/output_${genderType}_${expressionType}.ogg`)
      .then(response => response.arrayBuffer())
      .then(buffer => {
        return new Promise((resolve, reject) => {
          this.audioContext.decodeAudioData(buffer, resolve, reject);
        })
      });
  }

  /**
   * 天候を変える
   */
  onChangeWether() {
    this.currentTemperature = Math.floor( Math.random() * (this.max + 1 - this.min) ) + this.min;
    this.currentSolarRadiation = Math.floor( Math.random() * (this.max + 1 - this.min) ) + this.min;
    this.currentHumidity = Math.floor( Math.random() * (this.max + 1 - this.min) ) + this.min;
    this.currentExpressionType = this.makeExpressionType(this.currentTemperature, this.currentSolarRadiation, this.currentHumidity);
  }

/*  fetchSample(): Promise<any> {
    return fetch('assets/audio/output_taichi.ogg')
      .then(response => response.arrayBuffer())
      .then(buffer => {
        return new Promise((resolve, reject) => {
          this.audioContext.decodeAudioData(buffer, resolve, reject);
        })
      });
  }*/

  /**
   * "とまとん"が喋る
   */
  playTomatomVoice() {
    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = this.findAudioBuffer();
    bufferSource.connect(this.audioContext.destination);
    bufferSource.start(0);
  }

  /**
   * Fetch済みのAudioBufferを性別・表示から取得
   * @returns {AudioBuffer}
   */
  findAudioBuffer(): AudioBuffer {
    let result: AudioBuffer;
    switch (this.selectedGenderType) {
      case GenderType.BOY: {
        switch (this.currentExpressionType) {
          case ExpressionType.FUN: result = this.audioBufferBoyFun; break;
          case ExpressionType.NORMAL: result = this.audioBufferBoyNormal; break;
          case ExpressionType.PAIN: result = this.audioBufferBoyPain; break;
          case ExpressionType.SAD: result = this.audioBufferBoySad; break;
          case ExpressionType.PORKER_FACED: result = this.audioBufferBoyPorkerFaced; break;
          case ExpressionType.OOPS: result = this.audioBufferBoyOops; break;
        }
        break;
      }
      case GenderType.GIRL: {
        switch (this.currentExpressionType) {
          case ExpressionType.FUN: result = this.audioBufferGirlFun; break;
          case ExpressionType.NORMAL: result = this.audioBufferGirlNormal; break;
          case ExpressionType.PAIN: result = this.audioBufferGirlPain; break;
          case ExpressionType.SAD: result = this.audioBufferGirlSad; break;
          case ExpressionType.PORKER_FACED: result = this.audioBufferGirlPorkerFaced; break;
          case ExpressionType.OOPS: result = this.audioBufferGirlOops; break;
        }
        break;
      }
    }
    return result;
  }

/*
  playSample() {
    const bufferSource = this.audioContext.createBufferSource();
    bufferSource.buffer = this.audioBuffer;
    bufferSource.connect(this.audioContext.destination);
    bufferSource.start(0);
    this.chatFlag = true;
  }
*/

  /**
   * AITalk経由で音源をローカルに作成
   * @param {AiTalk} aiTalk
   */
  createVoice(aiTalk: AiTalk) {
    // TODO Not yet implementation.
    console.log(JSON.stringify(aiTalk));

    const headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
    const options = new RequestOptions({headers: headers});

    this.http.post(this.aiTalkWebApiUrl, JSON.stringify(aiTalk), options).subscribe((response) => {
      console.log(response.json().data);
      response.json();
    }, error => {console.error(error)}, () => {});
  }

  carrotTalk() {
    // console.log(SpeakerNameType.MAKI);
    // this.createVoice(new AiTalk(SpeakerNameType.MAKI, this.carrotText));
    // this.playSample();
    // TODO Not yet implementation.
  }

  onionTalk() {
    // TODO Not yet implementation.
  }

  tomatoTalk() {
    // TODO Not yet implementation.
  }

  pumpkinTalk() {
    // TODO Not yet implementation.
  }

  eggplantTalk() {
    // TODO Not yet implementation.
  }


  bellPepperTalk() {
    // TODO Not yet implementation.
  }

  /**
   * 温度、全天日射量、湿度から表情をつくる
   * @param {JudgedType} temperature
   * @param {JudgedType} solarRadiation
   * @param {JudgedType} humidity
   * @returns {ExpressionType}
   */
  makeExpressionType(temperature: JudgedType, solarRadiation: JudgedType, humidity: JudgedType): ExpressionType {
    let result: ExpressionType;

    switch (temperature) {
      case JudgedType.HIGH: {
        switch (solarRadiation) {
          case JudgedType.HIGH: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.SAD; break;
              case JudgedType.NORMAL: result = ExpressionType.PORKER_FACED; break;
              case JudgedType.LOW: result = ExpressionType.SAD; break;
            }
            break;
          }
          case JudgedType.NORMAL: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.OOPS; break;
              case JudgedType.NORMAL: result = ExpressionType.NORMAL; break;
              case JudgedType.LOW: result = ExpressionType.PAIN; break;
            }
            break;
          }
          case JudgedType.LOW: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.OOPS; break;
              case JudgedType.NORMAL: result = ExpressionType.PAIN; break;
              case JudgedType.LOW: result = ExpressionType.SAD; break;
            }
            break;
          }
        }
        break;
      }
      case JudgedType.NORMAL: {
        switch (solarRadiation) {
          case JudgedType.HIGH: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.SAD; break;
              case JudgedType.NORMAL: result = ExpressionType.NORMAL; break;
              case JudgedType.LOW: result = ExpressionType.PORKER_FACED; break;
            }
            break;
          }
          case JudgedType.NORMAL: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.NORMAL; break;
              case JudgedType.NORMAL: result = ExpressionType.FUN; break;
              case JudgedType.LOW: result = ExpressionType.NORMAL; break;
            }
            break;
          }
          case JudgedType.LOW: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.OOPS; break;
              case JudgedType.NORMAL: result = ExpressionType.NORMAL; break;
              case JudgedType.LOW: result = ExpressionType.PAIN; break;
            }
            break;
          }
        }
        break;
      }
      case JudgedType.LOW: {
        switch (solarRadiation) {
          case JudgedType.HIGH: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.SAD; break;
              case JudgedType.NORMAL: result = ExpressionType.NORMAL; break;
              case JudgedType.LOW: result = ExpressionType.PAIN; break;
            }
            break;
          }
          case JudgedType.NORMAL: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.OOPS; break;
              case JudgedType.NORMAL: result = ExpressionType.NORMAL; break;
              case JudgedType.LOW: result = ExpressionType.PAIN; break;
            }
            break;
          }
          case JudgedType.LOW: {
            switch (humidity) {
              case JudgedType.HIGH: result = ExpressionType.SAD; break;
              case JudgedType.NORMAL: result = ExpressionType.PAIN; break;
              case JudgedType.LOW: result = ExpressionType.SAD; break;
            }
            break;
          }
        }
        break;
      }
    }

    return result;
  }

  /**
   * "とまとん"の性別を決めるためのダイアログを表示する
   */
  openDialog() {
    let dialogRef = this.dialog.open(TomatoSelectDialog, {data: this.currentExpressionType});
    dialogRef.afterClosed().subscribe((result: GenderType) => {
      this.selectedGenderType = result;
      this.dialogFlag = true;
      this.playTomatomVoice();
      this.onChangeWether();
    });
  }
}

@Component({
  selector: 'tomato-select-dialog',
  templateUrl: './tomato-select-dialog.html',
})
export class TomatoSelectDialog {

  tomatomBoyImgUrl = `assets/img/${GenderType.BOY}-${this.currentExpressionType}.png`;
  tomatomGirlImgUrl = `assets/img/${GenderType.GIRL}-${this.currentExpressionType}.png`;

  constructor(public dialogRef: MdDialogRef<TomatoSelectDialog>
              , @Inject(MD_DIALOG_DATA) public currentExpressionType: ExpressionType) {}

  selectedBoy() {
    this.dialogRef.close(GenderType.BOY);
  }

  selectedGirl() {
    this.dialogRef.close(GenderType.GIRL);
  }
}
