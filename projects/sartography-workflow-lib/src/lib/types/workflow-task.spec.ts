import {WorkflowTask} from './workflow-task';

describe('WorkflowTask', () => {
  it('should return display name',() => {
    const task = new WorkflowTask();
    task.name = 'Task_PaintDry4321';
    task.title = 'Observe Pigment Slurry Dessication';
    task.properties = [{ id: 'display_name', value: 'Watch Paint Dry' }];
    expect(task.display_name()).toEqual('Watch Paint Dry');
  });

  it('should return title, minus the first word, if display name is not set',() => {
    const task = new WorkflowTask();
    task.name = 'Task_PaintDry4321';
    task.title = 'Observe Pigment Slurry Dessication';
    expect(task.display_name()).toEqual('Pigment Slurry Dessication');
  });

  it('should return task name if title and display name are not set',() => {
    const task = new WorkflowTask();
    task.name = 'Task_PaintDry4321';
    expect(task.display_name()).toEqual('Task_PaintDry4321');
  });
});
