export const ROUTES = {
  home: '/home',
  login: '/login',
  register: '/register',
  manageTask: '/manage-task',
  task: '/task',
  fight: '/fight',
  root: '/',
} as const;

export const getManageTaskRoute = (id?: number | string) => {
  return id ? `${ROUTES.manageTask}/${id}` : ROUTES.manageTask;
};

export const getTaskRoute = (id: number | string) => {
  return `${ROUTES.task}/${id}`;
};

