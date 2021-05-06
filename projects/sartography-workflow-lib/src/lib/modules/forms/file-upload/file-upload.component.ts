import {APP_BASE_HREF} from '@angular/common';
import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FileSystemFileEntry, NgxFileDropEntry} from 'ngx-file-drop';
import {ReplaySubject} from 'rxjs';
import {ApiService} from '../../../services/api.service';
import {AppEnvironment} from '../../../types/app-environment';
import {FileMeta} from '../../../types/file';
import {getFileIcon, getFileType} from '../../../util/file-type';
import {FileBaseComponent} from '../file-base/file-base.component';

@Component({
  selector: 'lib-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent extends FileBaseComponent {
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
    protected route: ActivatedRoute,
  ) {
    super(api, route);
    this.baseHref = appBaseHref;
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
      study_id: this.studyId,
      workflow_id: this.workflowId,
      form_field_key: this.field.key,
    };
    this.api.addFile(this.fileParams, fileMeta, file).subscribe(fm => {
      this.fileMetas.add(fm);
      this.updateFileList();
    });
  }

  removeFile($event, fileMeta: FileMeta) {
    $event.preventDefault();
    const fileMetaId = fileMeta.id;

    this.api.deleteFileMeta(fileMetaId).subscribe(() => {
      this.fileMetas.delete(fileMeta);
      this.updateFileList();
    });
  }

  updateFileList() {
    const fileMetasArray = Array.from(this.fileMetas);
    const fileMetaIds = fileMetasArray.map(fm => fm.id);

    if (this.model && this.formControl) {
      this.model[this.field.key] = fileMetaIds;
      this.formControl.setValue(fileMetaIds);
    }

    this.updateFileMetasSubject.next(fileMetasArray);
    this.filesUpdated.emit(fileMetasArray);
  }

  loadFiles() {
    this.api.getFileMetas(this.fileParams).subscribe(fms => {
      fms.forEach(fm => {
        this.fileMetas.add(fm);
      });
      this.updateFileList();
    });
  }
}
