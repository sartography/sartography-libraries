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
      'E0:Unit Paid Employee (Faculty), Instr-Northern Virginia, ' +
      'E0:EN-Elec/Computer Engr Dept, ' +
      'E1:UPG-UVA Speclty Care/Augusta, ' +
      'E0:4 Central Organ Transplant, ' +
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
      'Unit Paid Employee (Faculty), Instr-Northern Virginia, ' +
      'Elec/Computer Engr Dept, ' +
      'Speclty Care/Augusta, ' +
      'Central Organ Transplant, ' +
      'Something, ' +
      'Something Else, ' +
      'A & B & C, ';

    expect(pipe.transform(before)).toEqual(after);
  });
});
