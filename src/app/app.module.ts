import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MortarModule } from './mortar.module';
import { TweetComponent } from './tweet/tweet.component';

@NgModule({
  declarations: [
    AppComponent,
    TweetComponent,
  ],
  imports: [
    BrowserModule,
    MortarModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
