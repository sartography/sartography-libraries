export interface User {
  id: number;
  eppn?: string;
  email: string;
  display_name: string;
  role: string;
  institutional_role?: string;
  division?: string;
}
