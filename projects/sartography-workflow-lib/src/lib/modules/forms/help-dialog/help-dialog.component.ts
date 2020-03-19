import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MarkdownService} from 'ngx-markdown';

export interface HelpDialogData {
  title: string;
  text: string;
}

@Component({
  selector: 'lib-help-dialog',
  templateUrl: './help-dialog.component.html',
  styleUrls: ['./help-dialog.component.scss']
})
export class HelpDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<HelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HelpDialogData,
    private markdownService: MarkdownService
    ) {
  }

  ngOnInit(): void {
    const linkRenderer = this.markdownService.renderer.link;
    this.markdownService.renderer.link = (href, title, text) => {
      const html = linkRenderer.call(this.markdownService.renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
