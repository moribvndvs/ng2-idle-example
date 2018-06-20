# ng2-idle-example

## Installing the example

You will need a recent version of NodeJs installed, as well as a Git client. First, clone the repository and change to the new directory:

```shell
git clone https://github.com/HackedByChinese/ng2-idle-example.git
cd ng2-idle-example
```

You will need to install `angular-cli` by running the following command:

```shell
npm install -g angular-cli
```

Next, install the project's dependencies:

```shell
npm install
```

Now you can run `ng serve` for to start a dev server, and navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Create your own demo
This example shows you how to create a project using TypeScript and `angular-cli`, and includes the optional `@ng-idle/keepalive` module. It also uses [angular2-moment](https://github.com/urish/angular2-moment) to provide additional pipes for formatting the last ping time.

### Install TypeScript

You will get best results with TypeScript 2 or later. If you do not have this installed, run:

```shell
npm install -g typescript@2.0.0
```

### Create a project with Angular CLI

In this example, we'll use [angular-cli](https://cli.angular.io) to create, test, and serve your application. If you do not have Angular CLI installed, run:

```shell
npm uninstall -g angular-cli
npm cache clean
npm install -g angular-cli
```

Run the following commands to create your project:

```shell
ng new my-idle-app
cd my-idle-app
```

### Install @ng-idle

`@ng-idle` is available via NPM. Install it by running:

```shell
npm install --save @ng-idle/core @ng-idle/keepalive angular2-moment
```

### Set up your application module

Open `src/app/app.module.ts` and import `NgIdleKeepaliveModule` using:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup

import { MomentModule } from 'angular2-moment'; // optional, provides moment-style pipes for date formatting

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule,
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

#### Omitting keepalive

Use `import {NgIdleModule} from '@ng-idle/core'` instead of `NgIdleKeepaliveModule`.

### Extend your app component

Open `src/app/app.component.ts` and add a constructor. This is where we will configure the `Idle` service and start watching. By placing this code in the AppComponent constructor, the application will immediately start watching for idleness. This example also uses the default interrupt source by watching the document for common user input events. We also subscribe to various events to handle idle state. This is only an example; you can tailor your initialization and handling for your application's purposes.

```typescript
import { Component } from '@angular/core';

import {Idle, DEFAULT_INTERRUPTSOURCES} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;

  constructor(private idle: Idle, private keepalive: Keepalive) {
    // sets an idle timeout of 5 seconds, for testing purposes.
    idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }
}
```

We'll also add a simple status label and button to show the component is working, and to reset the demo if you time out. Open `src/app/app.component.html` and add the following:

```html
<p><strong>{{idleState}}</strong></p>
<p *ngIf="lastPing"><small>Last keepalive ping <strong>{{lastPing | amTimeAgo}}</strong></small></p>
<button (click)="reset()" *ngIf="timedOut">Restart</button>
```

#### Omitting keepalive

Simply eliminate the import for `Keepalive` and all references, and omit the `lastPing` field from your `AppComponent` and view.


### Run your project

Execute `ng serve` to serve your project at http://localhost:4200
