import {HttpErrorResponse, HttpResponse} from '@angular/common/http';

export const mockErrorResponse = new ErrorEvent('oopsie', {
  message: 'Ooooops!'
});

export const mockUpdatingResponse = new HttpResponse({
  status: 202,
  statusText: 'Updating'
});

export const mockCompleteResponse = new HttpResponse({
  status: 304,
  statusText: 'Up to date'
});
