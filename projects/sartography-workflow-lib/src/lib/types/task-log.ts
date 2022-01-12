export enum TaskLogLevel {
  CRITICAL = 'critical',
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface TaskLog {
  id?: number;
  level: TaskLogLevel;
  code: string;
  message: string;
  study_id: number;
  workflow_id: number;
  user_uid: string;
  timestamp: Date;
}

/**
 * A paginated, sorted, and filtered query on the Task Logs.  This can
 * be used to both execute a query by posting, and to read the results of a query
 * when it is returned.
 * You can set the code, page, per_page, sort_column and sort_reverse when sending,
 * other values will be overwritten on execution.
 */
export interface TaskLogQuery {
  code?: string; // Limits the task logs to just those that have this code.
  level?: string; // Limits the task logs to just those that have this level.
  user?: string; // Limits the task logs to just those that have this user.
  page: number; // The page number of this set of items in the paginated results.
  per_page: number; // Number of pages in the results.
  sort_column?: string; // The column on which to sort results.
  sort_reverse?: boolean; // whether to set the sort order of the sort_column to desc.
  items: TaskLog[]; // An array of TaskLogs
  total: number;  // Total number of results
  pages: number; // Total number of pages for this query.
  has_next?: boolean; // True if there is another page after this one.
  has_prev?: boolean; // True if there is another page before this one.
}
