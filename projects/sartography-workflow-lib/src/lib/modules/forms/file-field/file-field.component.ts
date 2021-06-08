import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {FileMeta} from '../../../types/file';
import {getFileType} from '../../../util/file-type';
import {isNumberDefined} from '../../../util/is-number-defined';
import {FieldType} from '@ngx-formly/material';

@Component({
  selector: 'lib-file-field',
  templateUrl: './file-field.component.html',
  styleUrls: ['./file-field.component.scss']
})

export class FileFieldComponent extends FieldType implements OnInit {
  selectedFile: File;
  selectedFileMeta: FileMeta;

  constructor(
    protected api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadFiles();

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
      study_id: this.to.study_id,
      workflow_id: this.to.workflow_id,
      form_field_key: this.getFileCode(),
      file
    };

    this.selectedFile = file;
    this.selectedFileMeta = fileMeta;
    this.formControl.setValue(fileMeta);

    console.log('Selected File Meta:' + this.formControl.value)
  }

  getFileCode() {
    /* very ugly, use data down in the formState placed there by
       the python_execute fuction in to_formly_pipe for caching the results.
     */
    const codeKey = this.field.id + '_doc_code';
    console.log('FORM STATE', this.formState);
    if(codeKey in this.formState) {
      return this.formState[codeKey];
    } else {
      return this.key;
    }
  }

  removeFile() {
      this.selectedFile = undefined;
      this.selectedFileMeta = undefined;
      this.model[this.getFileCode()] = undefined;
      this.formControl.setValue(undefined);
  }

  loadFiles() {

    const key = this.getFileCode();
    const fileId = this.model && this.model.hasOwnProperty(key) ? this.model[key] : null;
    console.log('I died ugly', key, fileId);

    if (isNumberDefined(fileId)) {
      this.api.getFileMeta(fileId).subscribe(fm => {
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
        this.formControl.setValue(undefined);
      });
    }
  }
}
