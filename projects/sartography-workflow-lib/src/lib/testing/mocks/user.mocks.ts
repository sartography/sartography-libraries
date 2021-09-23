import {User} from '../../types/user';

export const mockUser0: User = {
  id: 1234567890,
  uid: 'ose3v',
  is_admin: true,
  ldap_info: {
    uid: 'ose3v',
    given_name: 'Sissix',
    email_address: 'ose3v@wayfarer.coop',
    display_name: 'Sissix Seshkethet',
  }
};

export const mockUser1: User = {
  id: 3456098721,
  uid: 'rhh7n',
  is_admin: false,
  ldap_info: {
    uid: 'rhh7n',
    given_name: 'Rosemary',
    email_address: 'rhh7n@wayfarer.coop',
    display_name: 'Rosemary Harper',
  }
};

export const mockUsers = [
  mockUser0,
  mockUser1,
];
