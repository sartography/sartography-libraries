import {AfterViewInit, Component, OnInit} from '@angular/core';
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
export class FileFieldComponent extends FileBaseComponent implements OnInit  {
  selectedFile: File;
  selectedFileMeta: FileMeta;
  META_EXT = '_file_meta';

  constructor(
    protected api: ApiService,
  ) {
    super(api);
  }

  get fieldKey(): string {
    return this.key as string;
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
    // First, remove any existing file if it exists.
    console.log('addFile: this.selectedFileMeta: ', this.selectedFileMeta)
    if (this.selectedFileMeta) {
      console.log('addFile: this.selectedFileMeta: ');
      // this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
      //   this._addFile(file);
      // });
      this._updateFile(file, this.selectedFileMeta);
      // this._updateFileMeta(this.selectedFileMeta);
    } else {
      console.log('addFile: not this.selectedFileMeta: ');
      this._addFile(file);
    }
  }

  _updateFileMeta(fileMeta: FileMeta) {
    console.log('_updateFileMeta: fileMeta: ', fileMeta)
    this.api.updateFileMeta(fileMeta).subscribe(fm => {
      this.selectedFileMeta = fm;
    });
  }

  _updateFile(file: File, fileMeta: FileMeta) {
    console.log('this: ', this);
    console.log('this.fieldKey: ', this.fieldKey);
    console.log('file: ', file);
    console.log('fileMeta: ', fileMeta);
    let docCode = this.fieldKey;
    if ('doc_code' in this.field.templateOptions) {
      docCode = this.field.templateOptions.doc_code;
    }
    fileMeta.form_field_key = docCode;
    this.fileParams.form_field_key = fileMeta.form_field_key;
    fileMeta.name = file.name;

    // this.api.updateFileMeta(fileMeta).subscribe(fm => {
    //   this.selectedFileMeta = fm;
    // });
    this.api.updateFileData(fileMeta, file).subscribe(fm => {
      this.selectedFile = file;
      // this.selectedFileMeta = fm;
      this.model[this.fieldKey] = this.selectedFileMeta;
      this.fileId = fm.id;
      this.formControl.setValue(fm);
      console.log('File Field Model', this.model);
    });
  }

  _addFile(file: File) {
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: getFileType(file),
    };

    let docCode = this.fieldKey;
    if ('doc_code' in this.field.templateOptions) {
      docCode = this.field.templateOptions.doc_code;
    }
    fileMeta.form_field_key = docCode;
    this.fileParams.form_field_key = fileMeta.form_field_key;

    this.api.addFile(this.fileParams, fileMeta, file).subscribe(fm => {
      //
      this.selectedFile = file;
      this.selectedFileMeta = fm;
      this.model[this.fieldKey] = fm;
      this.fileId = fm.id;
      this.formControl.setValue(fm);
      console.log('File Field Model', this.model);
    });
  }

  removeFile() {
    if (this.selectedFileMeta) {
      this.api.deleteFileMeta(this.selectedFileMeta.id).subscribe(() => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.model[this.fieldKey] = undefined;
        this.fileId = undefined;
        this.formControl.setValue(undefined);
      });
    }
  }

  private checkField() {
    (this.options as any)._checkField({
      fieldGroup: this.field.fieldGroup,
      model: this.model,
      formControl: this.form,
      options: this.options,
    });
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
          this.model[this.fieldKey] = fm;
          this.formControl.setValue(fm);
        }
      }, error => {
        this.selectedFile = undefined;
        this.selectedFileMeta = undefined;
        this.model[this.fieldKey] = undefined;
        this.fileId = undefined;
        this.formControl.setValue(undefined);
      });
    }
  }
}
