import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiService} from '../../../services/api.service';
import {FileMeta} from '../../../types/file';
import {getFileType} from '../../../util/file-type';
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
  ) {
    super(api);
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

    this.api.addFile(this.fileParams, fileMeta, file).subscribe(fm => {
      this.selectedFile = file;
      this.selectedFileMeta = fm;
      this.model[this.key] = fm.id;
      this.fileId = fm.id;
      this.formControl.setValue(fm.id);
    });
  }

  removeFile() {
    if (this.selectedFileMeta) {
      this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.model[this.key] = undefined;
        this.fileId = undefined;
        this.formControl.setValue(undefined);
      });
    }
  }

  loadFiles() {
    if (isNumberDefined(this.fileId)) {
      this.api.getFileMeta(this.fileId).subscribe(fm => {
        const options: FilePropertyBag = {
          type: fm.content_type,
          lastModified: new Date(fm.last_modified).getTime(),
        };
        this.selectedFile = new File([], fm.name, options);
        this.selectedFileMeta = fm;
        if (this.model && this.formControl) {
          this.model[this.key] = fm.id;
          this.formControl.setValue(fm.id);
        }
      }, error => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.model[this.key] = undefined;
        this.fileId = undefined;
        this.formControl.setValue(undefined);
      });
    }
  }
}
