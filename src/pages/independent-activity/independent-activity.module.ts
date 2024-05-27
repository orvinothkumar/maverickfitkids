import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IndependentActivityPage } from './independent-activity';

@NgModule({
  declarations: [
    IndependentActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(IndependentActivityPage),
  ],
})
export class IndependentActivityPageModule {}
