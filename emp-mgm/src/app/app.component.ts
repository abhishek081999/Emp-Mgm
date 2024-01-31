import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'nobleui-angular';

  ngOnInit(): void { }
  constructor() {

    var retainValue = function (value) {
      return value;
    };
    moment.relativeTimeRounding(retainValue);
    moment.relativeTimeThreshold('s', 59);
    moment.relativeTimeThreshold('m', 59);
    moment.relativeTimeThreshold('h', 23);
    moment.updateLocale('en', {
      relativeTime: {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "a few seconds",
        m: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' min';
        },
        mm: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' min';
        },
        h: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' hr ' + Math.floor((number - Math.floor(number)) * 60) + ' min';
        },
        hh: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' hr ' + Math.floor((number - Math.floor(number)) * 60) + ' min';
        },
        d: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' day ' + Math.floor((number - Math.floor(number)) * 24) + ' hr ' + Math.floor((((number - Math.floor(number)) * 24) - Math.floor((number - Math.floor(number)) * 24)) * 60) + ' min';
        },
        dd: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' days ' + Math.floor((number - Math.floor(number)) * 24) + ' hr ' + Math.floor((((number - Math.floor(number)) * 24) - Math.floor((number - Math.floor(number)) * 24)) * 60) + ' min';
        },
        M: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' month ' + Math.floor((number - Math.floor(number)) * 30) + ' days';
        },
        MM: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' months ' + Math.floor((number - Math.floor(number)) * 30) + ' days';
        },
        y: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' year';
        },
        yy: function (number, withoutSuffix, key, isFuture) {
          return Math.floor(number) + ' years';
        }
      }
    });

  }

}
