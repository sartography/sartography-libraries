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
  itemsFromLdap(department: string): string[] {
    const ldapRe = new RegExp(/^([A-Z][0-9]+)\:([A-Z]+[\-|\s])+(.*)$|^([A-Z][0-9]+)\:([A-Za-z &]+)+$|^([A-Z][0-9]+)\:([\w]+)$/);
    const ldapItems = department.split(', ');
    const items = new Set<string>();

    for (const item of ldapItems) {
      if (ldapRe.test(item)) {
        const s = item.replace(ldapRe, (_, p1, p2, p3, p4, p5, p6, p7) => {
          return p3 || p5 || p7;
        });
        items.add(s);
      } else {
        items.add(item)
      }
    }

    return Array.from<string>(items);
  }


}
