import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, TestBed} from '@angular/core/testing';
import {ApiService} from '../../services/api.service';
import {MockEnvironment} from '../../testing/mocks/environment.mocks';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField} from '../../types/json';
import {ToFormlyPipe} from './to-formly.pipe';

describe('ToFormlyPipe', () => {
  let httpMock: HttpTestingController;
  let pipe: ToFormlyPipe;
  let apiService: ApiService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        ToFormlyPipe,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
      ]
    });
  }));

  beforeEach(() => {
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
    pipe = new ToFormlyPipe(apiService);
  });

  it('should create a pipe instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('converts string field to Formly input field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'full_name',
        label: 'What is your quest?',
        type: 'string',
        default_value: 'I seek the Holy Grail!',
        validation: [
          {
            name: 'max_length',
            config: '200',
          },
          {
            name: 'min_length',
            config: '5',
          },
        ],
        properties: [
          {
            id: 'hide_expression',
            value: 'model.full_name !== "Arthur, King of the Britons"'
          },
          {
            id: 'required_expression',
            value: 'model.favorite_color !== "blue" || model.favorite_color !== "yellow"'
          },
          {
            id: 'label_expression',
            value: 'model.has_grail ? "What shall we do now?" : "What is your quest?"'
          },
          {
            id: 'value_expression',
            value: 'model.has_grail ? "Take a nap" : "I seek the Holy Grail!"'
          },
          {
            id: 'placeholder',
            value: 'State your quest here, in a complete sentence.'
          },
          {
            id: 'description',
            value: 'The quest for the Grail is not archaeology; it\'s a race against evil!'
          },
          {
            id: 'markdown_description',
            value: '# Heading 2\nThis is some markdown text!'
          },
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].defaultValue).toEqual(before[0].default_value);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].hideExpression).toEqual(before[0].properties[0].value);
    expect(after[0].expressionProperties['templateOptions.required']).toEqual(before[0].properties[1].value);
    expect(after[0].expressionProperties['templateOptions.label']).toEqual(before[0].properties[2].value);

    const modelKey = `model.${after[0].key}`;
    expect(after[0].expressionProperties[modelKey]).toEqual(`${modelKey} || (${before[0].properties[3].value})`);
    expect(after[0].templateOptions.placeholder).toEqual(before[0].properties[4].value);
    expect(after[0].templateOptions.description).toEqual(before[0].properties[5].value);
    expect(after[0].templateOptions.markdownDescription).toEqual(before[0].properties[6].value);
    expect(after[0].templateOptions.maxLength).toEqual(200);
    expect(after[0].templateOptions.minLength).toEqual(5);
  });

  it('converts read only field to Formly readonly property', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'random_number',
        label: 'Pick a number. Any number',
        type: 'long',
        properties: [{id: 'read_only', value: 'true'}]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].templateOptions.readonly).toEqual(true);
  });

  it('converts boolean field to Formly radio group', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'should_ask_color',
        label: 'Does color affect your mood?',
        type: 'boolean',
        default_value: 'false',
        validation: [
          {
            name: 'required',
            config: 'true'
          }
        ],
        properties: [
          {
            id: 'help',
            value: 'help text goes here'
          }
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('radio');
    expect(after[0].defaultValue).toEqual(false);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.required).toEqual(true);
    expect(after[0].templateOptions.options[0].value).toEqual(true);
    expect(after[0].templateOptions.options[0].label).toEqual('Yes');
    expect(after[0].templateOptions.help).toEqual(before[0].properties[0].value);
  });

  it('converts enum fields to various Formly array fields', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'favorite_color',
        label: 'What is your favorite color?',
        type: 'enum',
        default_value: 'red',
        options: [
          {id: 'red', name: 'Red'},
          {id: 'green', name: 'Green'},
          {id: 'blue', name: 'Blue'},
        ],
        validation: [
          {
            name: 'required',
            config: 'true'
          }
        ],
        properties: [
          {
            id: 'help',
            value: 'help text goes here'
          }
        ]
      }
    ];
    const after = await pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('select');
    expect(after[0].defaultValue).toEqual('red');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.required).toEqual(true);

    // Stupid hack to check length of options array because its
    // type is any[] | Observable<any[]>
    let numOptions = 0;
    await after[0].templateOptions.options.forEach(() => numOptions++);
    expect(numOptions).toEqual(before[0].options.length);

    expect(after[0].templateOptions.options[0].value).toEqual('red');
    expect(after[0].templateOptions.options[0].label).toEqual('Red');
    expect(after[0].templateOptions.help).toEqual(before[0].properties[0].value);

    before[0].properties.push({id: 'enum_type', value: 'checkbox'});
    const afterMulticheckbox = await pipe.transform(before);
    expect(afterMulticheckbox[0].type).toEqual('multicheckbox');
    expect(afterMulticheckbox[0].className).toEqual('vertical-checkbox-group');

    before[0].properties[1] = {id: 'enum_type', value: 'radio'};
    const afterRadio = await pipe.transform(before);
    expect(afterRadio[0].type).toEqual('radio');
    expect(afterRadio[0].className).toEqual('vertical-radio-group');
  });

  it('converts date field to Formly date field', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'pb_time',
        label: 'What time is it?',
        type: 'date',
        default_value: '1955-11-12T22:04:12.345Z'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('datepicker');

    const afterDate = await after[0].defaultValue;
    expect(afterDate.toISOString()).toEqual(before[0].default_value);
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts long field to Formly number field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'random_number',
        label: 'Pick a number between 1 and 999',
        type: 'long',
        validation: [
          {name: 'min', config: '1'},
          {name: 'max', config: '999'},
        ],
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.type).toEqual('number');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.min).toEqual(1);
    expect(after[0].templateOptions.max).toEqual(999);
  });

  it('converts file field to Formly file field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'upload_file',
        label: 'TPS Report',
        type: 'file'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('file');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts files field to file uploader', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'upload_files',
        label: 'My New Filing Technique Is Unstoppable',
        type: 'files'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('files');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts textarea field to Formly textarea field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'life_story',
        label: 'Write a short novel that sardonically recounts the story of your life from the perspective of your best frenemy.',
        type: 'textarea',
        properties: [
          {id: 'rows', value: '5'},
          {id: 'cols', value: '3'},
          {id: 'autosize', value: 'true'},
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('textarea');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].templateOptions.rows).toEqual(5);
    expect(after[0].templateOptions.cols).toEqual(3);
    expect(after[0].templateOptions.autosize).toEqual(true);
  });

  it('converts tel field to Formly phone number field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'mobile_num',
        label: 'TPS Report',
        type: 'tel'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.type).toEqual('tel');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts email field to Formly email field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'email',
        label: 'Email address',
        type: 'email'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.type).toEqual('email');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts URL field to Formly URL field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'tps_report',
        label: 'TPS Report',
        type: 'url'
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.type).toEqual('url');
    expect(after[0].templateOptions.label).toEqual(before[0].label);
  });

  it('converts autocomplete field to Formly autocomplete field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'title',
        label: 'Recipe title',
        type: 'input',
      },
      {
        id: 'ingredients',
        label: 'Find Ingredient',
        type: 'autocomplete',
        properties: [
          {id: 'enum.options.limit', value: '5'},
        ]
      },
      {
        id: 'instructions',
        label: 'Write some instructions on making this recipe',
        type: 'textarea',
      },
    ];
    const fileParams: FileParams = {
      workflow_id: 123,
      task_id: '456',
      form_field_key: 'ingredients',
    }
    const after = pipe.transform(before, fileParams);
    expect(after[1].key).toEqual(before[1].id);
    expect(after[1].type).toEqual('autocomplete');
    expect(after[1].templateOptions.label).toEqual(before[1].label);
    expect(after[1].templateOptions.filter).toBeTruthy();

    // Should not set filter for other fields
    expect(after[0].templateOptions.filter).toBeUndefined();
    expect(after[2].templateOptions.filter).toBeUndefined();
  });

  it('converts group names into Formly field groups', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'first_name',
        label: 'First Name',
        type: 'string',
        properties: [
          {id: 'group', value: 'Contact Info'},
        ]
      },
      {
        id: 'line_1',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'group', value: 'Address'},
        ]
      },
      {
        id: 'line_2',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'group', value: 'Address'},
        ]
      },
      {
        id: 'last_name',
        label: 'Last Name',
        type: 'string',
        properties: [
          {id: 'group', value: 'Contact Info'},
        ]
      },
      {
        id: 'favorite_number',
        label: 'Favorite Number',
        type: 'long',
      },
    ];
    const after = pipe.transform(before);
    expect(after.length).toEqual(3);

    // Group 1
    expect(after[0].key).toEqual('contact_info');
    expect(after[0].templateOptions.label).toEqual(before[0].properties[0].value);
    expect(after[0].fieldGroup[0].key).toEqual(before[0].id);
    expect(after[0].fieldGroup[1].key).toEqual(before[3].id);

    // Group 2
    expect(after[1].key).toEqual('address');
    expect(after[1].templateOptions.label).toEqual(before[1].properties[0].value);
    expect(after[1].fieldGroup[0].key).toEqual(before[1].id);
    expect(after[1].fieldGroup[1].key).toEqual(before[2].id);

    // Last item has no group
    expect(after[2].key).toEqual(before[4].id);
    expect(after[2].templateOptions.label).toEqual(before[4].label);
    expect(after[2].fieldGroup).toBeUndefined();
  });


  it('converts repeating section names into Formly repeating sections', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'first_name',
        label: 'First Name',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'repeat_hide_expression', value: 'model.favorite_number > 0'},
          {id: 'group', value: 'Full Name'},
        ]
      },
      {
        id: 'line_1',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'group', value: 'Address'},
        ]
      },
      {
        id: 'line_2',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'group', value: 'Address'},
        ]
      },
      {
        id: 'last_name',
        label: 'Last Name',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'group', value: 'Full Name'},
        ]
      },
      {
        id: 'favorite_number',
        label: 'Favorite Number',
        type: 'long',
      },
    ];
    const after = pipe.transform(before);
    expect(after.length).toEqual(2);

    // Repeat Section
    expect(after[0].key).toEqual('contact');
    expect(after[0].templateOptions.label).toEqual(before[0].properties[0].value);
    expect(after[0].hideExpression).toBeDefined();
    expect(after[0].fieldArray).toBeDefined();
    expect(after[0].fieldArray.fieldGroup).toBeDefined();

    // Repeat Section - Group 1
    expect(after[0].fieldArray.fieldGroup[0].key).toEqual('full_name');
    expect(after[0].fieldArray.fieldGroup[0]).toBeDefined();
    expect(after[0].fieldArray.fieldGroup[0].fieldGroup[0]).toBeDefined();
    expect(after[0].fieldArray.fieldGroup[0].fieldGroup[0].templateOptions.label).toEqual(before[0].label);
    expect(after[0].fieldArray.fieldGroup[0].fieldGroup[1].templateOptions.label).toEqual(before[3].label);

    // Repeat Section - Group 2
    expect(after[0].fieldArray.fieldGroup[1].key).toEqual('address');
    expect(after[0].fieldArray.fieldGroup[1]).toBeDefined();
    expect(after[0].fieldArray.fieldGroup[1].fieldGroup[0]).toBeDefined();
    expect(after[0].fieldArray.fieldGroup[1].fieldGroup[0].templateOptions.label).toEqual(before[1].label);
    expect(after[0].fieldArray.fieldGroup[1].fieldGroup[1].templateOptions.label).toEqual(before[2].label);

    // Last item has no group
    expect(after[1].key).toEqual(before[4].id);
    expect(after[1].templateOptions.label).toEqual(before[4].label);
    expect(after[1].fieldGroup).toBeUndefined();
    expect(after[1].fieldArray).toBeUndefined();
  });

  it('logs an error if field type is not supported', () => {
    spyOn(console, 'error');
    const before: BpmnFormJsonField[] = [
      {
        id: 'bad_field',
        label: 'Mystery Field',
        type: 'mystery',
        properties: [
          {id: 'bad_prop', value: 'whatever'}
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual(before[0].type);
    expect(console.error).toHaveBeenCalled();
  });

});
