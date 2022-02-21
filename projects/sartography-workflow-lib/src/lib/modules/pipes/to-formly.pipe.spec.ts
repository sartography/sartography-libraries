import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {async, TestBed} from '@angular/core/testing';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {Router} from '@angular/router';
import {ApiService} from '../../services/api.service';
import {MockEnvironment} from '../../testing/mocks/environment.mocks';
import {FileParams} from '../../types/file';
import {BpmnFormJsonField} from '../../types/json';
import {ToFormlyPipe} from './to-formly.pipe';
import {APP_BASE_HREF} from '@angular/common';
import {isBoolean} from "util";

describe('ToFormlyPipe', () => {
  let httpMock: HttpTestingController;
  let pipe: ToFormlyPipe;
  let apiService: ApiService;
  const mockRouter = {navigate: jasmine.createSpy('navigate')};
  const workflowId = 20;
  const studyId = 15;
  const workflowSpec = 'PythonWorkflow';
  const fileParams = {workflow_id: workflowId, study_id: studyId, workflow_spec_id: workflowSpec};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatBottomSheetModule,
      ],
      declarations: [
        ToFormlyPipe,
      ],
      providers: [
        ApiService,
        {provide: 'APP_ENVIRONMENT', useClass: MockEnvironment},
        {provide: APP_BASE_HREF, useValue: '/'},
        {provide: Router, useValue: mockRouter},
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
        label: 'has_grail ? "What shall we do now?" : "What is your quest?"',
        type: 'string',
        default_value: 'has_grail ? "Take a nap" : "I seek the Holy Grail!"',
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
            value: 'full_name !== "Arthur, King of the Britons"'
          },
          {
            id: 'required_expression',
            value: 'favorite_color !== "blue" || favorite_color !== "yellow"'
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
    console.log(after[0])
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('input');
    expect(after[0].templateOptions.label).toEqual('');
    expect(after[0].hideExpression).toEqual(jasmine.any(Function));
    expect(after[0].expressionProperties['templateOptions.required']).toEqual(jasmine.any(Function));
    expect(after[0].expressionProperties['templateOptions.label']).toEqual(jasmine.any(Function));
    expect(after[0].expressionProperties['model.full_name']).toEqual(jasmine.any(Function));
    expect(after[0].templateOptions.placeholder).toEqual(before[0].properties[2].value);
    expect(after[0].templateOptions.description).toEqual(before[0].properties[3].value);
    expect(after[0].templateOptions.markdownDescription).toEqual(before[0].properties[4].value);
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

  it('provides the workflow_id, study_id as a template option to all fields', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'airspeed',
        label: 'What is the airspeed veolocity of an unladen swallow?',
        type: 'long',
      }
    ];
    const after = pipe.transform(before, fileParams);
    expect(after[0].templateOptions.workflow_id).toEqual(workflowId);
    expect(after[0].templateOptions.study_id).toEqual(studyId);
  });


  it('converts boolean field to Formly radio group', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'should_ask_color',
        label: '"Does color affect your mood?"',
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
    expect(after[0].expressionProperties['model.should_ask_color']).toEqual(jasmine.any(Function));
    expect(after[0].expressionProperties['templateOptions.label']).toEqual(jasmine.any(Function));
    expect(after[0].templateOptions.label).toEqual('');
    expect(after[0].templateOptions.required).toEqual(true);
    expect(after[0].templateOptions.options[0].value).toEqual(true);
    expect(after[0].templateOptions.options[0].label).toEqual('Yes');
    expect(after[0].templateOptions.help).toEqual(before[0].properties[0].value);
  });

  it('converts boolean field to Formly checkbox', () => {
    const before: BpmnFormJsonField[] =[
      {
        id: 'should_do_checkbox',
        label: 'Does this do the checkbox?',
        type: 'boolean',
        default_value: 'false',
        properties: [
          {
            id: 'boolean_property',
            value: 'checkbox'
          }
        ]
      }
    ];
    const after = pipe.transform(before);
    expect(after[0].type === 'checkbox');
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
    const defaultEnumValue = {value: 'red', label: 'Red'};
    const after = pipe.transform(before);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('select');
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
    expect(afterMulticheckbox[0].type).toEqual('select');
    expect(afterMulticheckbox[0].templateOptions.multiple).toEqual(true);

    before[0].properties[1] = {id: 'enum_type', value: 'radio'};
    const afterRadio = await pipe.transform(before);
    expect(afterRadio[0].type).toEqual('radio_data');
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
    const after = pipe.transform(before, fileParams);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('file');
    expect(after[0].templateOptions.workflow_id).toEqual(workflowId);
    expect(after[0].templateOptions.study_id).toEqual(studyId);
  });

  it('respects the doc_code for form fields overriding the form field id', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'upload_file',
        label: 'TPS Report',
        type: 'file',
        properties: [
        {id: 'doc_code', value: '"my_doc_code"'},
        ]
      }
    ];
    const after = pipe.transform(before, fileParams);
    expect(after[0].key).toEqual(before[0].id);
    expect(after[0].type).toEqual('file');
    expect(after[0].templateOptions.workflow_id).toEqual(workflowId);
    expect(after[0].templateOptions.study_id).toEqual(studyId);
    expect(after[0].templateOptions.doc_code).not.toBeNull();
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
  });

  it('converts textarea field to Formly textarea field', () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'life_story',
        label: 'Write a short novel that sardonically recounts the story of your life from the perspective of your best frenemy.',
        type: 'textarea',
        properties: [
          {id: 'rows', value: '7'},
          {id: 'cols', value: '3'},
          {id: 'autosize', value: 'true'},
        ]
      }
    ];
    const after1 = pipe.transform(before);
    expect(after1[0].key).toEqual(before[0].id);
    expect(after1[0].type).toEqual('textarea');
    expect(after1[0].templateOptions.rows).toEqual(7);
    expect(after1[0].templateOptions.cols).toEqual(3);
    expect(after1[0].templateOptions.autosize).toEqual(true);

    // Default to 5 rows
    before[0].properties.shift();
    const after2 = pipe.transform(before);
    expect(after2[0].templateOptions.rows).toEqual(5);
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
          {id: 'autocomplete_num', value: '15'},
        ]
      },
      {
        id: 'instructions',
        label: 'Write some instructions on making this recipe',
        type: 'textarea',
      },
    ];
    const getAutocompleteNumResultsSpy = spyOn((pipe as any), '_getAutocompleteNumResults').and.callThrough();
    const after = pipe.transform(before, fileParams);
    expect(getAutocompleteNumResultsSpy).toHaveBeenCalledWith(before[1], 5);
    expect(after[1].key).toEqual(before[1].id);
    expect(after[1].type).toEqual('autocomplete');
    expect(after[1].validators['validation']).toEqual(['autocomplete']);

  });

  it('should get the number of autocomplete results', () => {
    const expectedNum = 15;
    const defaultNum = 5;
    const before: BpmnFormJsonField = {
      id: 'ingredients',
      label: 'Find Ingredient',
      type: 'autocomplete',
      properties: [
        {id: 'autocomplete_num', value: `${expectedNum}`},
      ]
    };
    const actualNum = (pipe as any)._getAutocompleteNumResults(before, defaultNum);
    expect(actualNum).toEqual(expectedNum);

    const before2: BpmnFormJsonField = {
      id: 'ingredients',
      label: 'Find Ingredient',
      type: 'autocomplete',
    };
    const actualNum2 = (pipe as any)._getAutocompleteNumResults(before2, defaultNum);
    expect(actualNum2).toEqual(defaultNum);

    const before3: BpmnFormJsonField = {
      id: 'ingredients',
      label: 'Find Ingredient',
      type: 'autocomplete',
      properties: [
        {id: 'some_id', value: 'some_value'},
      ]
    };
    const actualNum3 = (pipe as any)._getAutocompleteNumResults(before3, defaultNum);
    expect(actualNum3).toEqual(defaultNum);
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
    expect(after[0].key).toBeUndefined('fieldGroup key should be empty so Formly does not nest the group data model');
    expect(after[0].templateOptions.label).toEqual(before[0].properties[0].value);
    expect(after[0].fieldGroup[0].key).toEqual(before[0].id);
    expect(after[0].fieldGroup[1].key).toEqual(before[3].id);

    // Group 2
    expect(after[1].key).toBeUndefined('fieldGroup key should be empty so Formly does not nest the group data model');
    expect(after[1].templateOptions.label).toEqual(before[1].properties[0].value);
    expect(after[1].fieldGroup[0].key).toEqual(before[1].id);
    expect(after[1].fieldGroup[1].key).toEqual(before[2].id);

    // Last item has no group
    expect(after[2].key).toEqual(before[4].id);
    expect(after[2].fieldGroup).toBeUndefined();
  });


  it('converts repeating section names into Formly repeating sections', async () => {
    const before: BpmnFormJsonField[] = [
      {
        id: 'first_name',
        label: 'First Name',
        type: 'string',
        validation: [
          {name: 'repeat_required', config: 'true'},
        ],
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'repeat_button_label', value: 'Add Some Contact Info'},
          {id: 'repeat_title', value: 'Enter your contact information here'},
          {id: 'repeat_edit_only', value: 'false'},
          {id: 'repeat_hide_expression', value: 'favorite_number > 0'},
          {id: 'repeat_required_expression', value: 'favorite_number === 42'},
          {id: 'group', value: 'Full Name'},
        ]
      },
      {
        id: 'line_1',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'group', value: 'Contact'},
        ]
      },
      {
        id: 'line_2',
        label: 'Street Address Line 1',
        type: 'string',
        properties: [
          {id: 'repeat', value: 'Contact'},
          {id: 'group', value: 'Contact'},
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
    expect(after[0].hideExpression).toBeDefined();
    expect(after[0].fieldGroup).toBeDefined();
    expect(after[0].fieldGroup.length).toEqual(1);

    const repeatSection = after[0].fieldGroup[0];
    expect(repeatSection.key).toEqual(before[0].properties[0].value);
    expect(repeatSection.expressionProperties).toBeDefined();
    expect(repeatSection.templateOptions.buttonLabel).toEqual(before[0].properties[1].value);
    expect(repeatSection.templateOptions.editOnly).toBeFalse();
    expect(repeatSection.templateOptions.required).toBeTrue();
    expect(repeatSection.fieldArray).toBeDefined();
    expect(repeatSection.fieldArray.fieldGroup).toBeDefined();
    expect(repeatSection.fieldArray.fieldGroup.length).toEqual(2);

    // Repeat Section - Group 1
    const repeatGroup1 = repeatSection.fieldArray.fieldGroup[0];
    expect(repeatGroup1.key).toBeUndefined('fieldGroup key should be empty so Formly does not wrap the group data model');
    expect(repeatGroup1).toBeDefined();
    expect(repeatGroup1.fieldGroup[0]).toBeDefined();

    // Repeat Section - Group 2
    const repeatGroup2 = repeatSection.fieldArray.fieldGroup[1];
    expect(repeatGroup2.key).toBeUndefined('fieldGroup key should be empty so Formly does not wrap the group data model');
    expect(repeatGroup2).toBeDefined();
    expect(repeatGroup2.fieldGroup[0]).toBeDefined();

    // Last item has no group
    expect(after[1].key).toEqual(before[4].id);
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

  it('should add and remove read-only class names', () => {
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
        properties: [
          {
            id: 'read_only_expression',
            value: 'true'
          },
          {
            id: 'enum_type',
            value: 'checkbox'
          },
        ]
      }
    ];
    const after = pipe.transform(before);

    after[0].expressionProperties['templateOptions.readonly'] = 'true';
    after[0].templateOptions.readonly = true;
    expect(after[0].expressionProperties['templateOptions.readonly']).toEqual('true');
    expect(after[0].templateOptions.readonly).toBeTrue();

    const result1 = (pipe as any)._readonlyClassName({}, {}, after[0]);
    expect(result1).toEqual('vertical-checkbox-group read-only should-float');

    after[0].expressionProperties['templateOptions.readonly'] = 'false';
    after[0].templateOptions.readonly = false;
    expect(after[0].expressionProperties['templateOptions.readonly']).toEqual('false');
    expect(after[0].templateOptions.readonly).toBeFalse();

    const result2 = (pipe as any)._readonlyClassName({}, {}, after[0]);
    expect(result2).toEqual('vertical-checkbox-group');
  });

});
