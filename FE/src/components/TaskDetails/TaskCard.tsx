import { Card, CardContent, Typography, Box, IconButton, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { AssignTaskToUserRequest, DeleteRequest, GetByIdRequest, IsTaskAssignedToUserRequest, TaskDTO, UpdateRequest } from "../../../typescript-client";
import { TaskDTOStatusEnum } from "../../../typescript-client";
import { useEffect, useState } from "react";
import { taskApi } from "../../api/api";
import { formatDate } from "../../lib/date";
import EnergyRoundedContainer from "../Generic/EnergyRoundedContainer";
import CaptionAndContent from "../Generic/CaptionAndContent";
import ResponsiveDialog from "../Generic/ResponsiveDialog";
import { useNavigate } from "react-router-dom";
import { StatusDropdown } from "../Generic/StatusDropdown";
import { toast } from "react-toastify";
import { fontFamilyStyle, fontSizeStyle } from "../../lib/style";
import { ROUTES } from "../../routing/routes";

const getNextAllowedStatuses = (currentStatus: TaskDTOStatusEnum, canComplete: boolean): TaskDTOStatusEnum[] => {
    switch (currentStatus) {
        case TaskDTOStatusEnum.Backlog:
            return [TaskDTOStatusEnum.InProgress];
        case TaskDTOStatusEnum.InProgress:
            return canComplete
                ? [TaskDTOStatusEnum.OnHold, TaskDTOStatusEnum.Completed]
                : [TaskDTOStatusEnum.OnHold];
        case TaskDTOStatusEnum.OnHold:
            return canComplete
                ? [TaskDTOStatusEnum.InProgress, TaskDTOStatusEnum.Completed]
                : [TaskDTOStatusEnum.InProgress];
        case TaskDTOStatusEnum.Completed:
            return [];
        default:
            return [];
    }
};

export default function TaskCard({ id, consumeEnergy }: { id: number, consumeEnergy: (ammount: number) => void }) {
    const navigate = useNavigate();

    const [task, setTask] = useState<TaskDTO>();
    const [isTaskAssignedToUser, setIsTaskAssignedToUser] = useState<boolean>(false);
    const [isTaskAssignedToAnotherUser, setIsTaskAssignedToAnotherUser] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [canComplete, setCanComplete] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            const request: GetByIdRequest = { id: id };
            const fetchedTask = await taskApi.getById(request);

            if (!fetchedTask) {
                toast.error('Failed to load task.', { containerId: 'global-toast' });
                return;
            }

            setTask(fetchedTask);
        };
        fetchTask();
    }, [id]);

    useEffect(() => {
        const fetchIsTaskAssignedToUser = async () => {
            const request: IsTaskAssignedToUserRequest = { taskId: id };
            const assigned = await taskApi.isTaskAssignedToUser(request);
            setIsTaskAssignedToUser(assigned);

            const hasAssignees = (task?.assignees?.size ?? 0) > 0;
            setIsTaskAssignedToAnotherUser(hasAssignees && !assigned);
        };

        if (task) {
            fetchIsTaskAssignedToUser();
        }
    }, [id, task]);

    // TODO: This logic should be moved to a backend endpoint
    // Currently fetching individual parent tasks; consider backend optimization for better performance
    useEffect(() => {
        const areDirectDependenciesComplete = async () => {
            if (!task?.parents || task.parents.size === 0) {
                setCanComplete(true);
                return;
            }

            for (const parentId of task.parents) {
                const parentTask = await taskApi.getById({ id: parentId });
                if (parentTask && parentTask.status !== TaskDTOStatusEnum.Completed) {
                    setCanComplete(false);
                    return;
                }
            }
            setCanComplete(true);
        };

        if (task) {
            areDirectDependenciesComplete();
        }
    }, [task]);

    const handleSelect = async (status: TaskDTOStatusEnum) => {
        if (status === TaskDTOStatusEnum.Completed && !canComplete) {
            toast.error("Cannot complete task: dependencies are not finished.", { containerId: 'global-toast' });
            return;
        }

        const updatedTask: TaskDTO = { ...task, status: status };
        const updateRequest: UpdateRequest = { id: updatedTask.id!, taskDTO: updatedTask };

        try {
            await taskApi.update(updateRequest);
            setTask(updatedTask);
            toast.success("Task status updated.", { containerId: 'global-toast' });
            if (status === TaskDTOStatusEnum.Completed && task?.energyCost) {
                consumeEnergy(task.energyCost);
            }
        } catch (error) {
            toast.error("Failed to update task status.", { containerId: 'global-toast' });
        }
    };

    const handleDeleteConfirm = async () => {
        const deleteRequest: DeleteRequest = { id: id };

        try {
            await taskApi._delete(deleteRequest);
            toast.success("Task deleted successfully.", { containerId: 'global-toast' });
            navigate(ROUTES.root);
        } catch (error) {
            toast.error("Failed to delete task.", { containerId: 'global-toast' });
        }
        setOpenDialog(false);
    };

    const handleTakeTaskClick = async () => {
        const takeTaskRequest: AssignTaskToUserRequest = { taskId: id };

        try {
            await taskApi.assignTaskToUser(takeTaskRequest);
            const updatedTask = await taskApi.getById({ id: id });
            setTask(updatedTask);
            setIsTaskAssignedToUser(true);
            setIsTaskAssignedToAnotherUser(false);
            toast.success("Task successfully assigned to you.", { containerId: 'global-toast' });
        } catch (error) {
            toast.error("Failed to assign task to you.", { containerId: 'global-toast' });
        }
    };

    if (!task) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            <Card sx={{ width: '100%', minWidth: 360, maxWidth: 360, borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EnergyRoundedContainer energyCost={task.energyCost || 0} />
                            <Typography variant="subtitle1" sx={[fontFamilyStyle, { fontSize: "32px", fontWeight: 700 }]}>
                                {task.title}
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => navigate(`/manage-task/${task.id}`)}>
                                <EditIcon sx={[fontSizeStyle]} />
                            </IconButton>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => setOpenDialog(true)}>
                                <DeleteIcon sx={[fontSizeStyle]} />
                            </IconButton>
                        </Box>
                    </Box>

                    <CaptionAndContent caption="Description:" content={task.description || "No description provided."} />
                    <CaptionAndContent caption="Created:" content={task.creationDate ? formatDate(task.creationDate) : "N/A"} />
                    <CaptionAndContent caption="Deadline:" content={task.deadline ? formatDate(task.deadline) : "N/A"} />

                    {!canComplete && (
                        <CaptionAndContent content="Some dependencies are not yet completed." />
                    )}

                    {isTaskAssignedToAnotherUser && (
                        <CaptionAndContent content="This task is already assigned to another user." />
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        {isTaskAssignedToUser ? (
                            getNextAllowedStatuses(task.status || TaskDTOStatusEnum.Backlog, canComplete).length > 0 ? (
                                <StatusDropdown
                                    categories={getNextAllowedStatuses(task.status || TaskDTOStatusEnum.Backlog, canComplete)}
                                    selected={task.status || TaskDTOStatusEnum.Backlog}
                                    backgroundColor="#9fafff"
                                    hoverBackgroundColor="#8a9fff"
                                    keyColor="#FFFFFF"
                                    handleSelect={handleSelect}
                                />
                            ) : (
                                <Typography sx={[fontFamilyStyle, { color: '#666' }]}>
                                    Task completed
                                </Typography>
                            )
                        ) : (
                            <Button
                                onClick={handleTakeTaskClick}
                                disabled={isTaskAssignedToAnotherUser}
                                startIcon={<AddIcon sx={{ color: isTaskAssignedToAnotherUser ? '#999' : '#FFFFFF' }} />}
                                sx={[fontFamilyStyle, fontSizeStyle, {
                                    backgroundColor: isTaskAssignedToAnotherUser ? '#e0e0e0' : '#9fafff',
                                    color: isTaskAssignedToAnotherUser ? '#999' : '#fff',
                                    borderRadius: '28px',
                                    width: 'auto',
                                    fontWeight: 700,
                                    textTransform: 'none',
                                    padding: '8px 16px',
                                    '&:hover': { backgroundColor: isTaskAssignedToAnotherUser ? '#e0e0e0' : '#8a9fff' },
                                    '&.Mui-disabled': { backgroundColor: '#e0e0e0', color: '#999' }
                                }]}
                            >
                                Take Task
                            </Button>
                        )}
                    </Box>
                </CardContent>
            </Card>

            <ResponsiveDialog open={openDialog} dialogTitle="Delete Task" dialogContent="Are you sure you want to delete this task?" cancelButtonText="Cancel" confirmButtonText="Delete" onCancel={() => setOpenDialog(false)} onConfirm={handleDeleteConfirm} />
        </Box>
    );
}