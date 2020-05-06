import {WorkflowTask} from './workflow-task';

describe('WorkflowTask', () => {
  it('should return display name',() => {
    const task = new WorkflowTask();
    const expectedName = 'Watch Paint Dry';
    task.name = 'Task_PaintDry4321';
    task.title = 'Observe Pigment Slurry Dessication';
    task.properties = [{id: 'some_other_property', value: 'some_value'}, { id: 'display_name', value: expectedName }];
    expect(task.display_name()).toEqual(expectedName);
  });

  it('should return title, minus the first word, if display name is not set',() => {
    const task = new WorkflowTask();
    const expectedName = 'Pigment Slurry Dessication';
    task.name = 'Task_PaintDry4321';
    task.title = 'Observe ' + expectedName;
    task.properties = [{id: 'some_other_property', value: 'some_value'}];
    expect(task.display_name()).toEqual(expectedName);

    task.properties = [];
    expect(task.display_name()).toEqual(expectedName);

    task.properties = null;
    expect(task.display_name()).toEqual(expectedName);
  });

  it('should return task name if title and display name are not set',() => {
    const task = new WorkflowTask();
    task.name = 'Task_PaintDry4321';
    task.title = '';
    task.properties = [{id: 'some_other_property', value: 'some_value'}];
    expect(task.display_name()).toEqual(task.name);

    task.properties = [];
    expect(task.display_name()).toEqual(task.name);

    task.title = null;
    task.properties = null;
    expect(task.display_name()).toEqual(task.name);
  });
});
