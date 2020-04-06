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

    if (this.workflowSpecId) {
      fileMeta.workflow_spec_id = this.workflowSpecId;
    }

    if (this.taskId) {
      fileMeta.task_id = this.taskId;
    }

    if (this.field.key) {
      fileMeta.form_field_key = this.field.key;
    }

    this.api.addFileMeta(this.fileParams, fileMeta).subscribe(fm => {
      fm.file = this.selectedFile;
      this.selectedFileMeta = fm;
      this.loadFiles();
    });
  }

  removeFile() {
    if (this.selectedFileMeta) {
      this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.loadFiles();
      });
    }
  }

  loadFiles() {
    this.api.getFileMetas(this.fileParams).subscribe(fms => {
      const fm = fms[0];
      if (fm && isNumberDefined(fm.id)) {
        this.api.getFileData(fm.id).subscribe(blob => {
          const file = new File([blob], fm.name, {type: fm.type, lastModified: new Date(fm.last_updated).getTime()});
          fm.file = file;
          this.selectedFileMeta = fm;
          this.selectedFile = file;
          if (this.model && this.formControl) {
            this.model[this.field.key] = fm.id;
            this.formControl.setValue(fm.id);
          }
        });
      }
    });
  }
}
