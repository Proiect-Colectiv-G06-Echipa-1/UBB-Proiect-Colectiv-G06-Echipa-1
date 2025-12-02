import {Configuration, TaskControllerApi, UserControllerApi} from "../../typescript-client";

function getToken() {
    return localStorage.getItem("jwt") || '';
}

const config = new Configuration({
    accessToken: getToken,
    basePath: 'http://localhost:8080'
})

const taskApi = new TaskControllerApi(config);
const userApi = new UserControllerApi(config);

export { taskApi, userApi };