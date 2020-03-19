import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FieldWrapper} from '@ngx-formly/core';
import {MarkdownService} from 'ngx-markdown';

@Component({
  selector: 'lib-markdown-description-wrapper',
  templateUrl: './markdown-description-wrapper.component.html',
  styleUrls: ['./markdown-description-wrapper.component.scss']
})
export class MarkdownDescriptionWrapperComponent extends FieldWrapper implements OnInit, AfterViewInit {
  constructor(private markdownService: MarkdownService) {
    super();
  }

  ngOnInit(): void {
    const linkRenderer = this.markdownService.renderer.link;
    this.markdownService.renderer.link = (href, title, text) => {
      const html = linkRenderer.call(this.markdownService.renderer, href, title, text);
      return html.replace(/^<a /, '<a target="_blank" rel="nofollow" ');
    };
  }

  ngAfterViewInit(): void {
  }
}

