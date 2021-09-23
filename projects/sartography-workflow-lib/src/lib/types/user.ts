export interface User {
  id: number;
  is_admin?: boolean;
  uid: string;
  ldap_info: LdapInfo;
}

export interface LdapInfo {
  uid: string;
  display_name?: string;
  given_name: string;
  email_address?: string;
  telephone_number?: string;
  title?: string;
  department?: string;
  affiliation?: string;
  eppn?: string;
}
