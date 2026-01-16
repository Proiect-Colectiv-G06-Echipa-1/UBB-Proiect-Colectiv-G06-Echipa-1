/**
 * @file api.ts
 * @brief API client configuration and instances.
 */
import {Configuration, TaskControllerApi, UserControllerApi} from "../../typescript-client";

/**
 * @brief Retrieves the JWT token from local storage.
 * @return The JWT token or an empty string if not found.
 */
function getToken() {
    return localStorage.getItem("jwt") || '';
}

/**
 * @brief Configuration for the API clients.
 */
const config = new Configuration({
    accessToken: getToken,
    basePath: 'http://localhost:8080'
})

/**
 * @brief Instance of TaskControllerApi for task-related operations.
 */
const taskApi = new TaskControllerApi(config);

/**
 * @brief Instance of UserControllerApi for user-related operations.
 */
const userApi = new UserControllerApi(config);

export { taskApi, userApi };