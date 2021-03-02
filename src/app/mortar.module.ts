import { NgModule } from '@angular/core';
import { MtrButtonModule } from '@mortar/angular/components/atomic/button';
import { MtrCardModule } from '@mortar/angular/components/atomic/card';
import { mtrIconHeart, mtrIconMessageReply, MtrIconModule, mtrIconRepeat, mtrIconShare } from '@mortar/angular/components/atomic/icon';

@NgModule({
  imports: [
    MtrButtonModule,
    MtrCardModule,
    MtrIconModule.forRoot([
      mtrIconMessageReply,
      mtrIconRepeat,
      mtrIconHeart,
      mtrIconShare,
    ])
  ],
  exports: [
    MtrButtonModule,
    MtrCardModule
  ],
})
export class MortarModule {}
