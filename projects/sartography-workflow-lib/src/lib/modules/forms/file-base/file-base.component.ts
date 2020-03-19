import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FieldType} from '@ngx-formly/material';
import {ApiService} from '../../../services/api.service';
import {FileParams} from '../../../types/file';

@Component({
  selector: 'lib-file-base',
  template: '',
})
export class FileBaseComponent extends FieldType implements OnInit {
  protected studyId: number;
  protected workflowId: number;
  protected workflowSpecId: string;
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

      if (paramMap.has('task_id')) {
        this.taskId = paramMap.get('task_id');
      }

      if (paramMap.has('workflow_spec_id')) {
        this.workflowSpecId = paramMap.get('workflow_spec_id');
      }

    });
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.fileParams = {
      study_id: this.studyId,
      workflow_spec_id: this.workflowSpecId,
      workflow_id: this.workflowId,
      task_id: this.taskId,
      form_field_key: this.field.key
    };
    this.loadFiles();
  }

  // To be overridden
  loadFiles() {
  }

}
