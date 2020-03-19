import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {MarkdownModule, MarkdownService} from 'ngx-markdown';
import createClone from 'rfdc';
import {mockWorkflowTask0} from '../../../testing/mocks/workflow-task.mocks';
import {ToFormlyPipe} from '../../pipes/to-formly.pipe';
import {UnescapeLineBreaksPipe} from '../../pipes/unescape-line-breaks.pipe';
import {HelpWrapperComponent} from './help-wrapper.component';

describe('HelpWrapperComponent', () => {
  let component: HelpWrapperComponent;
  let fixture: ComponentFixture<HelpWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpWrapperComponent,
        UnescapeLineBreaksPipe,
      ],
      imports: [
        MarkdownModule.forRoot(),
        MatDialogModule,
        MatIconModule,
      ],
      providers: [
        {provide: MatDialogRef, useValue: {}},
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            text: 'Just go out and talk to a tree. Make friends with it. There we go. Only God can make a tree - but you can paint one.'
          }
        },
        MarkdownService,
      ],
    })
      .compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(HelpWrapperComponent);
    component = fixture.componentInstance;
    const pipe = new ToFormlyPipe();
    const fields = createClone()(mockWorkflowTask0.form.fields);
    fields[0].properties.push({
      id: 'help',
      value: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)'
    });
    component.field = pipe.transform(fields)[0];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const event = jasmine.createSpyObj('event', ['preventDefault', 'stopPropagation']);
    const openSpy = spyOn(component.dialog, 'open').and.stub();
    component.openDialog(event, 'this is a title', 'and here is some text');
    expect(event.preventDefault).toHaveBeenCalled();
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(openSpy).toHaveBeenCalled();
  });
});
