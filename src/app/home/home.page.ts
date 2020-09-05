import { Component, OnInit } from '@angular/core';

import { AlertController, ModalController } from '@ionic/angular';
import { ModelPageComponent } from '../model-page/model-page.component';
import { CheatSheetComponent } from './cheat-sheet/cheat-sheet.component';
const peasantIcons = [
  './assets/icon/musket.svg',
  './assets/icon/mover-truck.svg',
  './assets/icon/binoculars.svg',
];
const neutralIcons = [
  './assets/icon/wizard.svg',
  './assets/icon/joker.svg',
  './assets/icon/knife.svg',
];
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  squad = [];
  draftsSquad = [];
  vampires = [];
  serialKillers = [];
  neutrals = [];
  deaths = [];
  king: string;
  oldKing: string;
  allTypes = [];
  peasants = [];

  peasantCount = 0;
  peasantIcons;
  neutralIcons;
  constructor(
    public alertController: AlertController,
    public modalController: ModalController
  ) {
    this.peasantIcons = peasantIcons;
    this.neutralIcons = neutralIcons;
  }

  ngOnInit(): void {}

  async addToSquad() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add player to squad',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Playername',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Ok',
          handler: (data) => {
            if (data.name && data.name !== '' && this.isNotInSquad(data.name)) {
              this.squad.push(data.name);
              this.draftsSquad.push(data.name);
            }
          },
        },
      ],
    });

    await alert.present();
  }
  isNotInSquad(name: string) {
    for (let i = 0; i < this.squad.length; i++) {
      if (name === this.squad[i]) {
        this.presentAlert('This player already exists!');
        return false;
      }
    }
    return true;
  }
  drawKing() {
    var randomEl = Math.floor(Math.random() * this.draftsSquad.length);

    if (this.isNotValidKing(randomEl)) {
      return;
    }

    if (this.oldKingIsKingAgain(randomEl)) {
      this.drawKing();
      return;
    }

    this.king = this.draftsSquad[randomEl];
    this.draftsSquad = this.draftsSquad.filter((value) => value !== this.king);
  }

  isNotValidKing(randomEl: any): boolean {
    return (
      this.draftsSquad[randomEl] === '' ||
      !this.draftsSquad[randomEl] ||
      this.king !== undefined ||
      (this.oldKing && this.draftsSquad.length <= 1)
    );
  }

  oldKingIsKingAgain(randomEl: number) {
    return this.draftsSquad[randomEl] === this.oldKing;
  }

  drawPlayer(playerType: string[]) {
    var randomEl = Math.floor(Math.random() * this.draftsSquad.length);

    if (this.isNotValidPlayer(randomEl)) {
      return;
    }

    playerType.push(this.draftsSquad[randomEl]);
    this.draftsSquad = this.draftsSquad.filter(
      (value) => value !== this.draftsSquad[randomEl]
    );
    if (playerType === this.peasants) {
      this.peasantCount++;
    }
  }

  isNotValidPlayer(randomEl: any): boolean {
    return this.draftsSquad[randomEl] === '' || !this.draftsSquad[randomEl];
  }

  async restartGame() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Restart',
      message: 'Do you want to keep squad?',
      buttons: [
        {
          text: 'No',

          cssClass: 'secondary',
          handler: (blah) => {
            this.squad = [];
            this.draftsSquad = [];
            this.vampires = [];
            this.neutrals = [];
            this.deaths = [];
            this.serialKillers = [];

            this.peasants = [];
            this.king = undefined;
            this.oldKing = undefined;
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.vampires = [];
            this.neutrals = [];

            this.serialKillers = [];
            this.deaths = [];
            this.peasants = [];
            this.draftsSquad = this.squad;
            this.oldKing = this.king;
            this.king = undefined;
          },
        },
      ],
    });

    await alert.present();
  }

  async showSquadModal() {
    this.prepareAllTypesArray();

    const modal = await this.modalController.create({
      component: ModelPageComponent,
      cssClass: 'my-custom-class',
      componentProps: {
        squad: this.squad,
        allTypes: this.allTypes,
        king: this.king,
      },
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    this.takeData(data);
  }

  prepareAllTypesArray() {
    this.allTypes.push(this.vampires); // 0
    this.allTypes.push(this.neutrals); // 1

    this.allTypes.push(this.peasants); // 2
    this.allTypes.push(this.deaths); // 3
    this.allTypes.push(this.draftsSquad); // 4
  }

  takeData(data: any) {
    this.squad = data.squad;
    this.vampires = data.vampires;
    this.neutrals = data.neutrals;
    this.peasants = data.peasants;
    this.deaths = data.deaths;
    this.king = data.king;
    this.draftsSquad = data.draftsSquad;

    this.allTypes = [];
  }

  async showCheatSheet() {
    const modal = await this.modalController.create({
      component: CheatSheetComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
  }

  async presentAlert(messagee: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Alert!',
      message: messagee,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
