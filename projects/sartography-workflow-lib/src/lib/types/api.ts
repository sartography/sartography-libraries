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
  line_number: number;  // in multi line scripts, returns the line that contains an error, otherwise 0
  offset: number; // For syntax errors, returns the character in the line where the error happens, otherwise 0.
  error_line: string;
}
