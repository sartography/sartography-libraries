import {MultiInstanceType, WorkflowTask, WorkflowTaskState, WorkflowTaskType} from '../../types/workflow-task';

export const mockWorkflowTask0: WorkflowTask = {
  id: '0',
  name: 'TASK_SPEC_NAME',
  title: 'Task Spec Title',
  documentation: '# Markdown Heading\n\nSome more Markdown text.',
  state: WorkflowTaskState.WAITING,
  type: WorkflowTaskType.USER_TASK,
  data: {},
  multi_instance_count: 0,
  multi_instance_index: 0,
  multi_instance_type: MultiInstanceType.NONE,
  process_name: '',
  form: {
    key: 'Create a beautiful little sunset.',
    fields: [
      {
        id: 'happyClouds',
        type: 'string',
        label: '\'Happy Clouds\'',
        properties: [
          {id: 'description', value: 'Decide where your cloud lives.'},
          {
            id: 'help',
            value: 'We don\'t want to set these clouds on fire. We\'ll play with clouds today.'
          }
        ]
      }
    ]
  }
};

export const mockWorkflowTask1: WorkflowTask = {
  id: '1',
  name: 'TASK_SPEC_NAME',
  title: 'Task Spec Title',
  documentation: '# Markdown Heading\n\nSome more Markdown text.',
  state: WorkflowTaskState.READY,
  type: WorkflowTaskType.USER_TASK,
  data: {},
  multi_instance_count: 0,
  multi_instance_index: 0,
  multi_instance_type: MultiInstanceType.NONE,
  process_name: '',
  form: {
    key: 'Form 0.0.0.0',
    fields: [
      {
        id: 'should_ask_color',
        label: '\'Does color affect your mood?\'',
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
            value: '# Markdown Heading\n\nSome more Markdown text.'
          }
        ]
      },
      {
        id: 'favorite_color',
        label: '\'What is your favorite color?\'',
        type: 'enum',
        default_value: 'indigo',
        options: [
          {
            id: 'red',
            name: 'Red'
          },
          {
            id: 'orange',
            name: 'Orange'
          },
          {
            id: 'yellow',
            name: 'Yellow'
          },
          {
            id: 'green',
            name: 'Green'
          },
          {
            id: 'blue',
            name: 'Blue'
          },
          {
            id: 'indigo',
            name: 'Indigo'
          },
          {
            id: 'violet',
            name: 'Violet'
          },
          {
            id: 'brown',
            name: 'Brown'
          },
          {
            id: 'black',
            name: 'Black'
          },
          {
            id: 'white',
            name: 'White'
          },
          {
            id: 'other',
            name: 'Other'
          }
        ],
        properties: [
          {
            id: 'hide_expression',
            value: '!model.should_ask_color'
          },
          {
            id: 'description',
            value: 'If you don\'t have a favorite color, choose the one you hate least.'
          },
          {
            id: 'help',
            value: '# Markdown Heading\n\nSome more Markdown text.'
          }
        ]
      },
      {
        id: 'other_color',
        label: 'Enter other color',
        type: 'string',
        properties: [
          {
            id: 'hide_expression',
            value: '!(model.should_ask_color && (model.favorite_color === \'other\'))'
          },
          {
            id: 'required_expression',
            value: 'model.should_ask_color && (model.favorite_color === \'other\')'
          },
          {
            id: 'description',
            value: 'Van Dyke Brown is a very nice brown, it\'s almost like a chocolate brown.'
          },
          {
            id: 'help',
            value: '# Markdown Heading\n\nSome more Markdown text.'
          }
        ]
      },
      {
        id: 'dessert',
        label: 'What do you want for dessert?',
        type: 'enum',
        options: [
          {
            id: 'carrot_cake',
            name: 'Carrot Cake'
          },
          {
            id: 'apple_pie',
            name: 'Apple Pie'
          },
          {
            id: 'bread_pudding',
            name: 'Bread Pudding'
          },
          {
            id: 'creme_brulee',
            name: 'Crème Brûlée'
          },
          {
            id: 'ice_cream',
            name: 'Ice Cream'
          },
          {
            id: 'berries_and_cream',
            name: 'Berries and Cream'
          }
        ],
        properties: [
          {
            id: 'enum_type',
            value: 'multicheckbox'
          },
          {
            id: 'description',
            value: 'Select all that apply.'
          },
          {
            id: 'help',
            value: '# Markdown Heading\n\nSome more Markdown text.'
          }
        ]
      },
      {
        id: 'dietary_restrictions',
        label: 'Any dietary restrictions?',
        type: 'enum',
        options: [
          {
            id: 'gf',
            name: 'Gluten Free'
          },
          {
            id: 'ovo_lacto_vegetarian',
            name: 'Vegetarian, but Eggs and Milk are OK.'
          },
          {
            id: 'gf_veg',
            name: 'Gluten Free Vegetarian'
          },
          {
            id: 'vegan',
            name: 'Vegan'
          },
          {
            id: 'gf_veg',
            name: 'Gluten Free Vegan'
          },
          {
            id: 'halal',
            name: 'Halal'
          },
          {
            id: 'kosher',
            name: 'Kosher'
          },
          {
            id: 'no_red_meat',
            name: 'I eat all foods except red meat.'
          },
          {
            id: 'only_red_meat',
            name: 'I only eat red meat. Nothing else.'
          },
          {
            id: 'only_food',
            name: 'I eat food.'
          },
          {
            id: 'none',
            name: 'I eat everything. Including things that aren\'t food.'
          }
        ],
        properties: [
          {
            id: 'enum_type',
            value: 'radio'
          },
          {
            id: 'description',
            value: 'You can choose only one. Sorry.'
          },
          {
            id: 'help',
            value: '# Markdown Heading\n\nSome more Markdown text.'
          }
        ]
      }
    ]
  }
};

export const mockWorkflowTasks: WorkflowTask[] = [
  mockWorkflowTask0,
  mockWorkflowTask1,
];
