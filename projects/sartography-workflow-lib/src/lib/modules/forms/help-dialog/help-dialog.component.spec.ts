import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MarkdownModule, MarkdownService} from 'ngx-markdown';
import {UnescapeLineBreaksPipe} from '../../pipes/unescape-line-breaks.pipe';
import {HelpDialogComponent} from './help-dialog.component';

describe('HelpDialogComponent', () => {
  let component: HelpDialogComponent;
  let fixture: ComponentFixture<HelpDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HelpDialogComponent,
        UnescapeLineBreaksPipe,
      ],
      imports: [
        MarkdownModule.forRoot(),
        MatDialogModule
      ],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: (dialogResult: any) => {
            }
          }
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            title: 'Happy Little Title',
            text: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)\n\n' +
              'Just go out and talk to a tree. Make friends with it. There we go. ' +
              'Only God can make a tree - but you can paint one.'
          }
        },
        MarkdownService,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close dialog', () => {
    const closeSpy = spyOn(component.dialogRef, 'close').and.stub();
    component.onNoClick();
    expect(closeSpy).toHaveBeenCalledWith();
  });
});
