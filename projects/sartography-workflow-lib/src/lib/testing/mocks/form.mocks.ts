export const mockFormlyFieldModel = {
  parent_group: {
    child_group: {
      child_group_first_field: '',
      child_group_second_field: ''
    },
    first_field: 'First field value',
    second_field: 'Second field value',
    third_field: {
      third_field_a: true,
      third_field_other: true,
    },
    third_field_other: 'Third field other value',
    fourth_field: new Date(),
    fifth_field: {id: 101, name: 'bob.txt'},
  }
};

export const mockFormlyFieldConfig = {
  key: 'parent_group',
  fieldGroup: [
    {
      key: 'child_group',
      templateOptions: {
        label: '\'First Group\'',
      },
      fieldGroup: [
        {
          key: 'child_group_first_field',
          type: 'input',
          templateOptions: {
            label: '\'First Group First Field\'',
            description: 'First Group First Field Description',
            markdownDescription: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)',
          }
        },
        {
          key: 'child_group_second_field',
          type: 'input',
          templateOptions: {
            label: '\'First Group Second Field\'',
            description: 'First Group Second Field Description',
            markdownDescription: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)',
          }
        },
      ]
    },
    {
      key: 'first_field',
      type: 'input',
      templateOptions: {
        label: 'First Field',
        description: '\'First Field Description\'',
        markdownDescription: '# Heading 1\n\n## Heading 2\n\n[link](https://sartography.com)',
      }
    },
    {
      key: 'second_field',
      type: 'input',
      templateOptions: {
        label: '\'Second Field\''
      }
    },
    {
      key: 'third_field', type: 'multicheckbox', templateOptions: {
        label: 'Third Field',
        options: [
          {label: 'Option A', value: 'third_field_a'},
          {label: 'Option B', value: 'third_field_b'},
          {label: 'Option C', value: 'third_field_c'},
          {label: 'Other', value: 'third_field_other'},
        ]
      }
    },
    {key: 'third_field_other', type: 'input', templateOptions: {label: 'Third Field Other'}},
    {key: 'fourth_field', type: 'datepicker', templateOptions: {label: 'Fourth Field Date'}},
    {key: 'fifth_field', type: 'file', templateOptions: {label: 'Fifth Field File'}},
  ],
};
