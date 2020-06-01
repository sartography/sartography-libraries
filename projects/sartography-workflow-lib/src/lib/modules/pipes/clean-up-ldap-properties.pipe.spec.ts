import {CleanUpLdapPropertiesPipe} from './clean-up-ldap-properties.pipe';

describe('CleanUpLdapPropertiesPipe', () => {
  const pipe = new CleanUpLdapPropertiesPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('removes LDAP codes from string', () => {
    const before = '' +
      'E1:Clinician Physician, ' +
      'E0:Professor, ' +
      'E0:AS-Psychology, ' +
      'E1:UPG-MD-NEUR Neurology, ' +
      'E0:MD-NEUR Neurology, ' +
      'E0:CU-Human Svcs, ' +
      'U1:Arts & Sciences Undergraduate, ' +
      'Something, ' +
      'Something Else, ' +
      'A & B & C, ';

    const after = '' +
      'Clinician Physician, ' +
      'Professor, ' +
      'Psychology, ' +
      'Neurology, ' +
      'Human Svcs, ' +
      'Arts & Sciences Undergraduate, ' +
      'Something, ' +
      'Something Else, ' +
      'A & B & C, ';

    expect(pipe.transform(before)).toEqual(after);
  });
});
