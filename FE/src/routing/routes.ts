/**
 * @file routes.ts
 * @brief Route constants and helper functions for navigation.
 */

/**
 * @brief Constants for all available routes in the application.
 */
export const ROUTES = {
  home: '/home',
  login: '/login',
  register: '/register',
  manageTask: '/manage-task',
  task: '/task',
  root: '/',
} as const;

/**
 * @brief Generates the route for managing a specific task or creating a new one.
 * @param id Optional task ID.
 * @return The formatted route string.
 */
export const getManageTaskRoute = (id?: number | string) => {
  return id ? `${ROUTES.manageTask}/${id}` : ROUTES.manageTask;
};

/**
 * @brief Generates the route for viewing details of a specific task.
 * @param id The task ID.
 * @return The formatted route string.
 */
export const getTaskRoute = (id: number | string) => {
  return `${ROUTES.task}/${id}`;
};

