import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {FileMeta} from '../../../types/file';
import {getFileType, newFileFromResponse} from '../../../util/file-type';
import {isNumberDefined} from '../../../util/is-number-defined';
import {FileBaseComponent} from '../file-base/file-base.component';

@Component({
  selector: 'lib-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})
export class FileFieldComponent extends FileBaseComponent implements OnInit {
  selectedFile: File;
  selectedFileMeta: FileMeta;

  constructor(
    protected api: ApiService,
    protected route: ActivatedRoute
  ) {
    super(api, route);
  }

  ngOnInit(): void {
    super.ngOnInit();

    if (this.field && this.field.defaultValue) {
      this.selectedFile = this.field.defaultValue as File;
    }
  }

  onFileSelected($event: Event) {
    this.selectedFile = ($event.target as HTMLFormElement).files[0];

    if (this.selectedFile) {
      this.addFile(this.selectedFile);
    } else if (this.selectedFileMeta && this.selectedFileMeta.file) {
      this.selectedFile = this.selectedFileMeta.file;
    }
  }

  getFileName() {
    return this.selectedFile ? this.selectedFile.name : 'Click to select a file';
  }

  addFile(file: File) {
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: getFileType(file),
      file,
    };

    if (isNumberDefined(this.studyId)) {
      fileMeta.study_id = this.studyId;
    }

    if (isNumberDefined(this.workflowId)) {
      fileMeta.workflow_id = this.workflowId;
    }

    if (this.key) {
      fileMeta.form_field_key = this.key;
    }

    this.api.addFileMeta(this.fileParams, fileMeta).subscribe(fm => {
      fm.file = this.selectedFile;
      this.selectedFileMeta = fm;
      this.model[this.key] = fm.id;
      this.formControl.setValue(fm.id);
      this.loadFiles();
    });
  }

  removeFile() {
    if (this.selectedFileMeta) {
      this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.model[this.key] = undefined;
        this.formControl.setValue(undefined);
        this.loadFiles();
      });
    }
  }

  loadFiles() {
    if (isNumberDefined(this.fileId)) {
      this.api.getFileMeta(this.fileId).subscribe(fm => {
        this.api.getFileData(fm.id).subscribe(response => {
          const file = newFileFromResponse(fm, response);
          fm.file = file;
          this.selectedFileMeta = fm;
          this.selectedFile = file;
          if (this.model && this.formControl) {
            this.model[this.key] = fm.id;
            this.formControl.setValue(fm.id);
          }
        });
      });
    }
  }
}
