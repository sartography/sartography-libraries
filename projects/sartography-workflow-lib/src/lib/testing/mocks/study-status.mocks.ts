import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export const mockErrorResponse = new ErrorEvent('oopsie', {
  message: 'Ooooops!'
});

export const mockApiError = {
  code: 'string',
  message: 'string',
  task_id: 'string',
  task_name: 'string',
  file_name: 'string',
  tag: 'string',
};

export const mockApiErrorResponse = new HttpErrorResponse({
  status: 400,
  statusText: `{
  "code": "file_integrity_error",
  "task_id": "",
  "task_name": "",
  "file_name": "",
  "task_data": "",
  "message": "You are attempting to delete a file that is required by other records in the system."
}`
});

export const mockUpdatingResponse = new HttpResponse({
  status: 202,
  statusText: 'Updating'
});

export const mockCompleteResponse = new HttpResponse({
  status: 304,
  statusText: 'Up to date'
});
