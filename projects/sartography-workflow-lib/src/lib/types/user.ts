export interface User {
  id: number;
  is_admin?: boolean;
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
  redirect_url?: string;
}
