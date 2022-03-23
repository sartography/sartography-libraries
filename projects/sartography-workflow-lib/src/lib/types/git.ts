export interface GitRepo {
  untracked?: string[];
  branch: string;
  changes?: string[];
  merge_branch: string;
  directory: string;
  display_push?: boolean;
  display_merge?: boolean;
}
