import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cleanUpLdapProperties'
})
export class CleanUpLdapPropertiesPipe implements PipeTransform {

  // Takes a comma-delimited string from LDAP and returns a human-readable string.
  transform(value: string, ...args: any[]): any {
    return this.itemsFromLdap(value).join(', ')
  }

  // E1:Clinician Physician
  // E0:Professor
  // E0:AS-Psychology
  // E1:UPG-MD-NEUR Neurology
  // E0:MD-NEUR Neurology
  // E0:CU-Human Svcs
  // U1:Arts & Sciences Undergraduate
  // E0:Unit Paid Employee (Faculty), Instr-Northern Virginia
  itemsFromLdap(department: string): string[] {
    const ldapRe = new RegExp(/^([A-Z][0-9]+):([A-Z]+[\-|\s])+(.*)$|^([A-Z][0-9]+):[0-9 ]?([A-Za-z&\-\(\)\, ]+\s)+(.*)$|^([A-Z][0-9]+):([&\-\(\)\,\w]+)$/);
    const ldapItems = department.split(', ');
    const items = new Set<string>();

    for (const item of ldapItems) {
      if (ldapRe.test(item)) {
        const s = item.replace(ldapRe, (match, p1, p2, p3, p4, p5, p6, p7, p8) => {
          if (p4 && p5 && p6) {
            return p5 + p6;
          } else  if (p7 && p8) {
            return p8;
          } else {
            return p3 || p5 || p7;
          }
        });
        items.add(s.trim());
      } else {
        items.add(item.trim())
      }
    }

    return Array.from<string>(items);
  }


}
