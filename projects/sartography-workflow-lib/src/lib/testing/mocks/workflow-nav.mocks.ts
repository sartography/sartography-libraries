import {WorkflowNavItem} from '../../types/workflow';
import {NavItemType} from '../../types/workflow-task';

export const mockNav0: WorkflowNavItem[] = [
  {
    spec_id: 0, name: '', spec_type: NavItemType.MANUAL_TASK, indent: 0
  },
  {
    spec_id: 0, name: '', spec_type: NavItemType.NONE_TASK, indent: 0
  }
];

export const mockNav1: WorkflowNavItem[] = [
  {
    spec_id: 0, name: '', spec_type: NavItemType.MANUAL_TASK, indent: 0
  },
  {
    spec_id: 0, name: '', spec_type: NavItemType.MANUAL_TASK, indent: 0
  }
];
