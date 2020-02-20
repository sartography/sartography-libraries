export interface User {
  id: number;
  role: string;
  uid: string;
  email_address?: string;
  display_name?: string;
  affiliation?: string;
  eppn?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
}

export interface UserParams {
  uid: string;
  email_address?: string;
  display_name?: string;
  affiliation?: string;
  eppn?: string;
  first_name?: string;
  last_name?: string;
  title?: string;
}
