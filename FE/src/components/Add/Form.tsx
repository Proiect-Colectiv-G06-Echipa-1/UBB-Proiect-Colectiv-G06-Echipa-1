import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import StringFormInput from "./StringFormInput";
import DateFormInput from "./DateFormInput";
import EnergyFormInput from "./EnergyFormInput";
//import DependencyFormInput from "./DependencyFormInput";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { taskApi } from "../../api/api";
import { TaskDTOStatusEnum, type AddRequest, type TaskDTO } from "../../../typescript-client";
import { TaskFormSchema } from "../../lib/zod";
//import SaveIcon from "@mui/icons-material/Save";

const maxDamage = 20;
const maxProcrastinationDamage = 10;

export default function Form() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState(new Date());
    const [energy, setEnergy] = useState(0);
    const [dependency, setDependency] = useState<Set<number>>(new Set());

    const [error, setError] = useState<string>("");

    useEffect(() => {
        const load = async () => {
            // TO DO:
        }
        load();
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        const damage = (energy * 2) % maxDamage + 1;
        const procrastinationDamage = energy % maxProcrastinationDamage + 1;
        const creationDate = new Date();
        
        const newTask : TaskDTO = {
            title: title,
            description: description,
            // TODO: Change this to Backlog (when BE is updated)
            status: TaskDTOStatusEnum.Pending,
            energyCost: energy,
            damage: damage,
            procrastinationDamage: procrastinationDamage,
            creationDate: creationDate,
            // TODO: Change this to deadline
            lastUpdateDate: deadline,
            parents: dependency,
        }

        const result = TaskFormSchema.safeParse(newTask);

        if (!result.success) {
            setError(result.error.issues[0].message);
            return;
        }

        setError("");

        const request : AddRequest = {
            taskDTO: newTask,
        }

        await taskApi.add(request);

        
        navigate("/home");
    };
    
    return (
        <Box flexGrow={1} display="flex" justifyContent="center" alignItems="center">
            <Box p={4} border={1} borderRadius={8} borderColor="grey.300" minWidth={570} bgcolor={"white"} position="relative" pb={8}>
                <Stack spacing={2} mb={4}>
                    <StringFormInput label="Title" value={title} setValue={setTitle} />
                    <StringFormInput label="Description" value={description} setValue={setDescription} />

                    <DateFormInput label="Deadline" value={deadline} setValue={setDeadline} />

                    <EnergyFormInput label="Energy Level" value={energy} setValue={setEnergy} />

                    {/* <DependencyFormInput label="Dependency" selectedItems={dependency} setSelectedItems={setDependency} availableItems={items.filter(item => item.id !== existingTask?.id).map(item => item.name)}/> */}

                    {error && <Box color="error.main">{error}</Box>}

                    <IconButton onClick={handleSubmit} sx={{position: "absolute", bottom: 24, right: 24, bgcolor: "primary.main", color: "white", width: 48, height: 48,
                        "&:hover": { bgcolor: "primary.dark"},
                        "&:disabled": {bgcolor: "grey.400", color: "grey.600"}
                    }}>
                        {/* {mode === 'edit' ? <SaveIcon /> : <AddIcon />} */}
                        <AddIcon />
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
}