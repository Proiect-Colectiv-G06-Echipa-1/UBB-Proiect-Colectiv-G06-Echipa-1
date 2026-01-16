import { TaskDTOStatusEnum } from "../../typescript-client";

export const formatStatus = (status: TaskDTOStatusEnum): string => {
  switch (status) {
    case TaskDTOStatusEnum.Backlog:
      return "Backlog";
    case TaskDTOStatusEnum.InProgress:
      return "In Progress";
    case TaskDTOStatusEnum.OnHold:
      return "On Hold";
    case TaskDTOStatusEnum.Completed:
      return "Completed";
    default:
      return status;
  }
};

export const allCategories: TaskDTOStatusEnum[] = [
  TaskDTOStatusEnum.Backlog,
  TaskDTOStatusEnum.InProgress,
  TaskDTOStatusEnum.OnHold,
  TaskDTOStatusEnum.Completed,
];

export const unAssignableCategories: TaskDTOStatusEnum[] = [
  TaskDTOStatusEnum.InProgress,
  TaskDTOStatusEnum.OnHold,
];