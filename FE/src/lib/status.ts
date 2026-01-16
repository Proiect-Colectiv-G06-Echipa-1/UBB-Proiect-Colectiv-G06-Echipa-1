/**
 * @file status.ts
 * @brief Utilities and constants for task statuses.
 */
import { TaskDTOStatusEnum } from "../../typescript-client";

/**
 * @brief Formats a TaskDTOStatusEnum into a human-readable string.
 * @param status The status enum value.
 * @return The formatted status string.
 */
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

/**
 * @brief List of all possible task categories/statuses.
 */
export const allCategories: TaskDTOStatusEnum[] = [
  TaskDTOStatusEnum.Backlog,
  TaskDTOStatusEnum.InProgress,
  TaskDTOStatusEnum.OnHold,
  TaskDTOStatusEnum.Completed,
];

/**
 * @brief Categories that are not directly assignable in certain contexts.
 */
export const unAssignableCategories: TaskDTOStatusEnum[] = [
  TaskDTOStatusEnum.InProgress,
  TaskDTOStatusEnum.OnHold,
];