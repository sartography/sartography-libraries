export interface ApiError {
  status_code: number;
  code: string;
  message: string;
  task_id: string;
  task_name: string;
  file_name: string;
  hint?: string;
  tag: string;
  task_data: any;
}
