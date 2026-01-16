import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import StringFormInput from "./StringFormInput";
import DateFormInput from "./DateFormInput";
import EnergyFormInput from "./EnergyFormInput";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { taskApi } from "../../api/api";
import { TaskDTOStatusEnum, type AddRequest, type GetByIdRequest, type TaskDTO, type UpdateRequest } from "../../../typescript-client";
import { TaskFormSchema } from "../../lib/zod";
import SaveIcon from "@mui/icons-material/Save";
import DependencyFormInput from "./DependencyFormInput";
import { toast } from "react-toastify";
import { ROUTES } from "../../routing/routes";

const maxDamage = 20;
const maxProcrastinationDamage = 10;

export default function Form() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [energy, setEnergy] = useState(0);
    const [status, setStatus] = useState<TaskDTOStatusEnum>(TaskDTOStatusEnum.Backlog);
    const [dependency, setDependency] = useState<Set<number>>(new Set());
    const [error, setError] = useState<string>("");
    const [tasks, setTasks] = useState<TaskDTO[]>([]);
    const [selectedTasks, setSelectedTasks] = useState<TaskDTO[]>([]);

    const {id} = useParams<{id: string}>();

    useEffect(() => {
        const load = async () => {
            if (id) {
                const request : GetByIdRequest = {
                    id: Number(id)
                }

                let existingTask: TaskDTO | undefined;

                try {
                    existingTask = await taskApi.getById(request);

                    if (!existingTask) {
                        toast.error('Failed to load task.', { containerId: 'global-toast' });
                        return;
                    }
                }
                catch (error) {
                    toast.error('Failed to load task.', { containerId: 'global-toast' });
                    return;
                }

                setTitle(existingTask.title || "");
                setDescription(existingTask.description || "");
                setDeadline(existingTask.deadline || new Date());
                setEnergy(existingTask.energyCost || 0);
                setDependency(new Set(existingTask.parents || []));
                setStatus(existingTask.status || TaskDTOStatusEnum.Backlog);
            }
        }
        load();
    }, [id]);

    useEffect(() => {
        const loadAllTasks = async () => {
            const allTasks = await taskApi.getAll();
            setTasks(allTasks);
        }
        loadAllTasks();
    }, []);

    useEffect(() => {
        const taskDependencies = tasks.filter((task) => dependency.has(task.id || -1));
        setSelectedTasks(taskDependencies);
        console.log(taskDependencies);
    }, [dependency, tasks]);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const damage = (energy * 2) % maxDamage + 1;
            const procrastinationDamage = energy % maxProcrastinationDamage + 1;
            const creationDate = new Date();
            const dependencyIds : Set<number> = new Set();
            selectedTasks.forEach((task) => {
                if (task.id) dependencyIds.add(task.id);
            });
            
            const newTask : TaskDTO = {
                title: title,
                description: description,
                status: status,
                energyCost: energy,
                damage: damage,
                procrastinationDamage: procrastinationDamage,
                creationDate: creationDate,
                deadline: deadline,
                parents: dependencyIds,
            }

            const result = TaskFormSchema.safeParse(newTask);

            if (!result.success) {
                setError(result.error.issues[0].message);
                toast.error(result.error.issues[0].message, { containerId: 'global-toast' });
                return;
            }

            setError("");

            if (id) {
                newTask.id = Number(id);

                const request: UpdateRequest = {
                    id: Number(id),
                    taskDTO: newTask,
                }
                
                await taskApi.update(request);
                toast.success('Task updated successfully!', { containerId: 'global-toast' });
            }
            else{
                const request : AddRequest = {
                    taskDTO: newTask,
                }
        
                await taskApi.add(request);
                toast.success('Task created successfully!', { containerId: 'global-toast' });
            }
            
            navigate(ROUTES.home);
        } catch (error) {
            console.error('Failed to submit task:', error);
            toast.error('Failed to save task. Please try again.', { containerId: 'global-toast' });
        }
    };
    
    return (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', margin: 0, padding: 0 }}>
            <Box sx={{ 
                p: 4, 
                border: '1px solid', 
                borderColor: 'grey.300', 
                borderRadius: 8, 
                minWidth: 570, 
                bgcolor: 'white', 
                position: 'relative', 
                pb: 8,
                margin: 0
            }}>
                <Stack spacing={2} mb={4}>
                    <StringFormInput label="Title" value={title} setValue={setTitle} />
                    <StringFormInput label="Description" value={description} setValue={setDescription} />

                    <DateFormInput label="Deadline" value={deadline} setValue={setDeadline} />

                    <EnergyFormInput label="Energy Level" value={energy} setValue={setEnergy} />

                    <DependencyFormInput label="Dependency" selectedTasksDependencies={selectedTasks} setSelectedTasksDependencies={setSelectedTasks} allTasks={tasks} />

                    {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}

                    <IconButton onClick={handleSubmit} sx={{
                        position: 'absolute', 
                        bottom: 24, 
                        right: 24, 
                        bgcolor: 'primary.main', 
                        color: 'white', 
                        width: 48, 
                        height: 48,
                        '&:hover': { bgcolor: 'primary.dark' },
                        '&:disabled': { bgcolor: 'grey.400', color: 'grey.600' }
                    }}>
                        {id ? <SaveIcon /> : <AddIcon />}
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
}