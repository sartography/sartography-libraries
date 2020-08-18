import {User} from '../../types/user';

export const mockUser0: User = {
  id: 1234567890,
  eppn: 'ose3v',
  uid: 'ose3v',
  email_address: 'ose3v@wayfarer.coop',
  display_name: 'Sissix Seshkethet',
  is_admin: true,
};

export const mockUser1: User = {
  id: 3456098721,
  eppn: 'rhh7n',
  uid: 'rhh7n',
  email_address: 'rhh7n@wayfarer.coop',
  display_name: 'Rosemary Harper',
  is_admin: false,
};

export const mockUsers = [
  mockUser0,
  mockUser1,
];
