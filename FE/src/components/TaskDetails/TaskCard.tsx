import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { DeleteRequest, GetByIdRequest, TaskDTO } from "../../../typescript-client";
import { useEffect, useState } from "react";
import { taskApi } from "../../api/api";
import { formatDate } from "../../lib/date";
import EnergyRoundedContainer from "../Generic/EnergyRoundedContainer";
import CaptionAndContent from "../Generic/CaptionAndContent";
import ResponsiveDialog from "../Generic/ResponsiveDialog";
import { useNavigate } from "react-router-dom";

export default function TaskCard({id}: {id: number}) {
    const navigate = useNavigate(); 

    const [task, setTask] = useState<TaskDTO>();
    const [open, setOpen] = useState(false);

    const handleDeleteConfirm = async () => {
        const deleteRequest : DeleteRequest = {
            id: id
        }
        await taskApi._delete(deleteRequest);
        setOpen(false);

        navigate("/");
    };

    useEffect(() => {
        const fetchTask = async () => {
            const request : GetByIdRequest = {
                id: id
            }
            const fetchedTask = taskApi.getById(request);
            setTask(await fetchedTask);
        };
        fetchTask();
    }, [id]);

    // HELP: If anyone knows a better way to handle, please fix
    if (task === undefined) {
        return null;
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', padding: 0 }}>
            <Card sx={{ width: '100%', minWidth: 360, maxWidth: 360, borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative'}}>
                <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <EnergyRoundedContainer energyCost={task.energyCost || 0} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, fontSize: '18px' }}>
                            {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => {navigate(`/manage-task/${task.id}`)}}>
                                <EditIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                            <IconButton size="small" sx={{ padding: '4px' }} onClick={() => setOpen(true)}>
                                <DeleteIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <CaptionAndContent caption="Description:" content={task.description || "No description provided."} />
                    <CaptionAndContent caption="Created:" content={task.creationDate ? formatDate(task.creationDate) : "N/A"} />
                    <CaptionAndContent caption="Deadline:" content={task.lastUpdateDate ? formatDate(task.lastUpdateDate) : "N/A"} />
                </CardContent>
            </Card>

            <ResponsiveDialog open={open} dialogTitle="Delete Task" dialogContent="Are you sure you want to delete this task?" cancelButtonText="Cancel" confirmButtonText="Delete" onCancel={() => setOpen(false)} onConfirm={handleDeleteConfirm} />
        </Box>
    );
}