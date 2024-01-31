import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal, private _sanitizer: DomSanitizer) {
    this.videolink = this._sanitizer.bypassSecurityTrustResourceUrl('');
  }
  @Input() data
  videolink
  ngOnInit(): void {
    this.videolink = this._sanitizer.bypassSecurityTrustResourceUrl(String(this.data.link));
  }

}
