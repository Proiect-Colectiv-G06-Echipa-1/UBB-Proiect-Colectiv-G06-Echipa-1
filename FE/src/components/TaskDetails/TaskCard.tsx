import { Card, CardContent, Typography, Box, IconButton, Button } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import type { DeleteRequest, GetByIdRequest, TaskDTO, UpdateRequest } from "../../../typescript-client";
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
import { useAuth } from "../../authentication/AuthContext";

export default function TaskCard({ id }: { id: number }) {
    const navigate = useNavigate();
    const { userId } = useAuth();

    const [task, setTask] = useState<TaskDTO>();
    const [open, setOpen] = useState(false);
    const [canComplete, setCanComplete] = useState(false);

    const handleDeleteConfirm = async () => {
        const deleteRequest: DeleteRequest = {
            id: id
        }

        try {
            await taskApi._delete(deleteRequest);
            toast.success("Task deleted successfully.", { containerId: 'global-toast' });
        } catch (error) {
            toast.error("Failed to delete task.", { containerId: 'global-toast' });
        }
        setOpen(false);

        navigate("/");
    };

    useEffect(() => {
        const fetchTask = async () => {
            const request: GetByIdRequest = {
                id: id
            }

            try {
                const fetchedTask = await taskApi.getById(request);

                if (!fetchedTask) {
                    toast.error('Failed to load task.', { containerId: 'global-toast' });
                    return;
                }
                setTask(fetchedTask);

                const depsComplete = await checkDependenciesComplete(fetchedTask.parents);
                setCanComplete(depsComplete);
            } catch (error) {
                toast.error('Failed to load task.', { containerId: 'global-toast' });
                return;
            }
        };
        fetchTask();
    }, [id]);

    const isAssignedToCurrentUser = (): boolean => {
        if (!userId || !task?.assignees) {
            return false;
        }
        return task.assignees.has(userId);
    };

    const hasAssignees = (): boolean => {
        return task?.assignees !== undefined && task.assignees.size > 0;
    };

    const checkDependenciesComplete = async (parentIds: Set<number> | undefined): Promise<boolean> => {
        if (!parentIds || parentIds.size === 0) {
            return true;
        }

        try {
            const allTasks = await taskApi.getAll();

            for (const parentId of parentIds) {
                const parentTask = allTasks.find(t => t.id === parentId);

                if (!parentTask) {
                    continue;
                }

                if (parentTask.status !== TaskDTOStatusEnum.Completed) {
                    return false;
                }

                const parentDepsComplete = await checkDependenciesComplete(parentTask.parents);
                if (!parentDepsComplete) {
                    return false;
                }
            }

            return true;
        } catch (error) {
            console.error("Failed to check dependencies:", error);
            return false;
        }
    };

    const handleSelect = async (status: TaskDTOStatusEnum) => {
        const updatedTask: TaskDTO = {
            ...task,
            status: status
        };

        const updateRequest: UpdateRequest = {
            id: updatedTask.id!,
            taskDTO: updatedTask
        }

        try {
            await taskApi.update(updateRequest);
            setTask(updatedTask);
            toast.success("Task status updated successfully.", { containerId: 'global-toast' });
        } catch (error) {
            toast.error("Failed to update task status.", { containerId: 'global-toast' });
        }
    }

    const handleTakeTaskClick = async () => {
        //pt cora
        // if (!userId || !task) {
        //     toast.error("Unable to take task.", { containerId: 'global-toast' });
        //     return;
        // }

        // const updatedAssignees = new Set(task.assignees || []);
        // updatedAssignees.add(userId);

        // const updatedTask: TaskDTO = {
        //     ...task,
        //     assignees: updatedAssignees
        // };

        // const updateRequest: UpdateRequest = {
        //     id: task.id!,
        //     taskDTO: updatedTask
        // }

        // try {
        //     await taskApi.update(updateRequest);
        //     setTask(updatedTask);
        //     toast.success("Task assigned to you successfully.", { containerId: 'global-toast' });
        // } catch (error) {
        //     toast.error("Failed to take task.", { containerId: 'global-toast' });
        // }
    }

    // HELP: If anyone knows a better way to handle, please fix
    if (task === undefined) {
        return null;
    }

    const getAllowedStatuses = (): TaskDTOStatusEnum[] => {
        const statuses: TaskDTOStatusEnum[] = [];

        if (isAssignedToCurrentUser()) {
            statuses.push(TaskDTOStatusEnum.InProgress);
        }

        if (isAssignedToCurrentUser() && canComplete) {
            statuses.push(TaskDTOStatusEnum.Completed);
        }

        return statuses;
    };

    const allowedStatuses = getAllowedStatuses();
    const isUserAssigned = isAssignedToCurrentUser();
    const canTakeTask = !hasAssignees();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            <Card sx={{ width: '100%', minWidth: 360, maxWidth: 360, borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative' }}>
                <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <EnergyRoundedContainer energyCost={task.energyCost || 0} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, fontSize: '18px' }}>
                            {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => { navigate(`/manage-task/${task.id}`) }}>
                                <EditIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => setOpen(true)}>
                                <DeleteIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <CaptionAndContent caption="Description:" content={task.description || "No description provided."} />
                    <CaptionAndContent caption="Created:" content={task.creationDate ? formatDate(task.creationDate) : "N/A"} />
                    <CaptionAndContent caption="Deadline:" content={task.deadline ? formatDate(task.deadline) : "N/A"} />

                    {/* Show warning if dependencies are not complete */}
                    {!canComplete && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#fff3cd', borderRadius: 1, border: '1px solid #ffc107' }}>
                            <Typography variant="caption" sx={{ color: '#856404', fontWeight: 600 }}>
                                This task has incomplete dependencies
                            </Typography>
                        </Box>
                    )}

                    {/* Show info if user is not assigned */}
                    {!isUserAssigned && hasAssignees() && (
                        <Box sx={{ mt: 1, p: 1, bgcolor: '#d1ecf1', borderRadius: 1, border: '1px solid #bee5eb' }}>
                            <Typography variant="caption" sx={{ color: '#0c5460', fontWeight: 600 }}>
                                This task is assigned to someone else
                            </Typography>
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Button
                            onClick={handleTakeTaskClick}
                            disabled={!canTakeTask}
                            startIcon={<AddIcon sx={{ color: canTakeTask ? '#FFFFFF' : '#999' }} />}
                            sx={{
                                backgroundColor: canTakeTask ? '#9fafff' : '#e0e0e0',
                                color: canTakeTask ? '#fff' : '#999',
                                borderRadius: '28px',
                                width: 'auto',
                                fontSize: '16px',
                                fontWeight: 700,
                                textTransform: 'none',
                                padding: '8px 16px',
                                '&:hover': { backgroundColor: canTakeTask ? '#8a9fff' : '#e0e0e0' },
                                '&.Mui-disabled': {
                                    backgroundColor: '#e0e0e0',
                                    color: '#999'
                                }
                            }}
                        >
                            Take Task
                        </Button>
                        <StatusDropdown
                            selected={task.status || TaskDTOStatusEnum.Backlog}
                            backgroundColor="#9fafff"
                            hoverBackgroundColor="#8a9fff"
                            keyColor="#FFFFFF"
                            handleSelect={handleSelect}
                            allowedStatuses={allowedStatuses}
                            disabled={!isUserAssigned || allowedStatuses.length === 0}
                        />
                    </Box>
                </CardContent>
            </Card>

            <ResponsiveDialog open={open} dialogTitle="Delete Task" dialogContent="Are you sure you want to delete this task?" cancelButtonText="Cancel" confirmButtonText="Delete" onCancel={() => setOpen(false)} onConfirm={handleDeleteConfirm} />
        </Box>
    );
}