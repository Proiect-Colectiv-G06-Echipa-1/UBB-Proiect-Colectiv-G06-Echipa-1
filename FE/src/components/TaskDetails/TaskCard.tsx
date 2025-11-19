import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { GetByIdRequest, TaskDTO } from "../../../typescript-client";
import { useEffect, useState } from "react";
import { taskApi } from "../../api/api";
import { formatDate } from "../../lib/date";

export default function TaskCard({id}: {id: number}) {
    const [task, setTask] = useState<TaskDTO>();

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
            <Card sx={{ width: '100%', maxWidth: 360, borderRadius: 3, boxShadow: '0 2px 4px rgba(0,0,0,0.1)', position: 'relative'}}>
                <CardContent sx={{ padding: 2, '&:last-child': { paddingBottom: 2 } }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
                        <Box sx={{width: 32, height: 32, borderRadius: '50%', bgcolor: '#E9E3F2', color: '#4F378A', display: 'flex',
                            alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0}}>
                            {task.energyCost}
                        </Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, flex: 1, fontSize: '18px' }}>
                            {task.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, ml: 'auto' }}>
                            <IconButton size="small" sx={{ padding: '4px' }}>
                                <EditIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                            <IconButton size="small" sx={{ padding: '4px' }}>
                                <DeleteIcon sx={{ fontSize: '18px' }} />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5, wordBreak: "break-word",}}>
                            Description: {task.description}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 1.5 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                            Created: {task.creationDate && formatDate(task.creationDate)}
                        </Typography>
                    </Box>

                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ fontWeight: 700, display: 'block', mb: 0.5 }}>
                            Deadline: {/* TODO: Change this to Deadline */}
                            {task.lastUpdateDate && formatDate(task.lastUpdateDate)}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}