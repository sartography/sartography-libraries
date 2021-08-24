import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FieldType} from '@ngx-formly/material';
import {ApiService} from '../../../services/api.service';
import {FileMeta, FileParams} from '../../../types/file';

@Component({
  selector: 'lib-file-base',
  templateUrl: './file-base.component.html',
  styleUrls: ['./file-base.component.scss']
})
export class FileBaseComponent extends FieldType implements OnInit {
  protected studyId: number;
  protected workflowId: number;
  protected workflowSpecId: string;
  protected fileMeta: FileMeta;
  protected fileId: number;
  protected fileParams: FileParams;

  constructor(
    protected api: ApiService,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    const key = this.key as string;
    this.fileParams = {
      study_id: this.to.study_id,
      workflow_id: this.to.workflow_id,
      task_spec_name: this.to.task_spec_name,
      form_field_key: key,
    };
    this.fileId = this.model && this.model.hasOwnProperty(key) ? this.model[key].id : null;
    this.loadFiles();
  }

  // To be overridden
  loadFiles() {
  }

}
