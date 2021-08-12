import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MarkdownModule, MarkdownService} from 'ngx-markdown';
import * as cloneDeep from 'lodash/cloneDeep';
import {mockWorkflowTask0} from '../../../testing/mocks/workflow-task.mocks';
import {ToFormlyPipe} from '../../pipes/to-formly.pipe';
import {UnescapeLineBreaksPipe} from '../../pipes/unescape-line-breaks.pipe';
import {MarkdownDescriptionWrapperComponent} from './markdown-description-wrapper.component';

describe('MarkdownDescriptionWrapperComponent', () => {
  let component: MarkdownDescriptionWrapperComponent;
  let fixture: ComponentFixture<MarkdownDescriptionWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MarkdownDescriptionWrapperComponent,
        UnescapeLineBreaksPipe,
      ],
      imports: [
        MarkdownModule.forRoot(),
      ],
      providers: [
        MarkdownService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(MarkdownDescriptionWrapperComponent);
    component = fixture.componentInstance;
    const pipe = new ToFormlyPipe();
    const fields = cloneDeep(mockWorkflowTask0.form.fields);
    fields[0].properties.push({
      id: 'markdown_description',
      value: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)'
    });
    component.field = pipe.transform(fields)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
