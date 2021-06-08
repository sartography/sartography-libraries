import {APP_BASE_HREF} from '@angular/common';
import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {AppEnvironment} from '../../../types/app-environment';
import {FileMeta} from '../../../types/file';
import {getFileIcon, getFileType} from '../../../util/file-type';
import {FieldType} from '@ngx-formly/material';

@Component({
  selector: 'lib-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FieldType implements  OnInit {
  @Output() filesUpdated: EventEmitter<FileMeta[]> = new EventEmitter<FileMeta[]>();
  droppedFiles: NgxFileDropEntry[] = [];
  fileMetas = new Set<FileMeta>();
  updateFileMetasSubject = new ReplaySubject<FileMeta[]>();
  displayedColumns: string[] = [
    'type',
    'name',
    'size',
    'lastModifiedDate',
    'actions'
  ];
  dropZoneHover = false;
  getFileIcon = getFileIcon;
  baseHref = '/';

  constructor(
    @Inject('APP_ENVIRONMENT') private environment: AppEnvironment,
    @Inject(APP_BASE_HREF) public appBaseHref: string,
    protected api: ApiService,
  ) {
    super();
    this.baseHref = appBaseHref;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.loadFiles();
  }

  dropped(droppedFiles: NgxFileDropEntry[]) {
    this.droppedFiles = droppedFiles;
    this.dropZoneHover = false;
    this.droppedFiles.forEach((droppedFile, i) => {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry: FileSystemFileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((newFile: File) => this.addFile(newFile));
      }
    });

    this.updateFileList();
  }

  fileOver($event) {
    this.dropZoneHover = true;
  }

  fileLeave($event) {
    this.dropZoneHover = false;
  }

  formatSize(bytes: number, decimalPlaces = 2): string {
    const sizes = ['KB', 'MB', 'GB', 'TB'];
    const factor = Math.pow(2, 10 * decimalPlaces);

    for (let i = 0; i < sizes.length; i++) {
      const divisor = Math.pow(2, (10 * (i + 1)));
      const nextDivisor = Math.pow(2, (10 * (i + 2)));

      if (bytes < nextDivisor) {
        const num = Math.round(bytes / divisor * factor) / factor;
        return `${num.toFixed(decimalPlaces)} ${sizes[i]}`;
      }
    }
  }

  truncate(s: string, maxLength = 20): string {
    if (s) {
      if (s.length > maxLength) {
        return s.slice(0, maxLength) + '...';
      } else {
        return s;
      }
    } else {
      return '';
    }
  }

  addFile(file: File) {
    const fileMeta: FileMeta = {
      content_type: file.type,
      name: file.name,
      type: getFileType(file),
      study_id: this.to.study_id,
      workflow_id: this.to.workflow_id,
      form_field_key: this.to.form_field_key,
      file
    };
    this.fileMetas.add(fileMeta);
    this.updateFileList();
  }

  removeFile($event, fileMeta: FileMeta) {
    $event.preventDefault();
    this.fileMetas.delete(fileMeta);
    this.updateFileList();
  }

  updateFileList() {
    const fileMetasArray = Array.from(this.fileMetas);
    this.updateFileMetasSubject.next(fileMetasArray);
    this.filesUpdated.emit(fileMetasArray);
    this.formControl.setValue(fileMetasArray);
  }

  loadFiles() {
    this.api.getFileMetas({workflow_id: this.to.workflow_id, form_field_key: this.key}).subscribe(fms => {
      fms.forEach(fm => {
        this.fileMetas.add(fm);
      });
      this.updateFileList();
    });
  }
}
