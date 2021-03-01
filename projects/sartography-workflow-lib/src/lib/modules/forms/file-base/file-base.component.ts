import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FieldType} from '@ngx-formly/material';
import {ApiService} from '../../../services/api.service';
import {FileParams} from '../../../types/file';

@Component({
  selector: 'lib-file-base',
  templateUrl: './file-base.component.html',
  styleUrls: ['./file-base.component.scss']
})
export class FileBaseComponent extends FieldType implements OnInit {
  protected studyId: number;
  protected workflowId: number;
  protected workflowSpecId: string;
  protected fileId: number;
  protected taskId: string;
  protected fileParams: FileParams;

  constructor(
    protected api: ApiService,
    protected route: ActivatedRoute,
  ) {
    super();
    this.route.paramMap.subscribe(paramMap => {
      if (paramMap.has('study_id')) {
        this.studyId = parseInt(paramMap.get('study_id'), 10);
      }

      if (paramMap.has('workflow_id')) {
        this.workflowId = parseInt(paramMap.get('workflow_id'), 10);
      }

      if (paramMap.has('workflow_spec_id')) {
        this.workflowSpecId = paramMap.get('workflow_spec_id');
      }

      if (paramMap.has('task_id')) {
        this.taskId = paramMap.get('task_id');
      }


    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fileParams = {
      study_id: this.studyId,
      workflow_id: this.workflowId,
      task_id: this.taskId,
      form_field_key: this.key,
    };

    this.fileId = this.model && this.model.hasOwnProperty(this.key) ? this.model[this.key] : null;
    this.loadFiles();
  }

  // To be overridden
  loadFiles() {
  }

}
