import { useEffect, useState } from "react";
import type { EnergyItem } from "../../types";
import { useNavigate } from "react-router-dom";
import { createItem, getAll, updateItem } from "../../repository/energyRepository";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import StringFormInput from "./StringFormInput";
import DateFormInput from "./DateFormInput";
import EnergyFormInput from "./EnergyFormInput";
import DependencyFormInput from "./DependencyFormInput";
import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";

export default function Form({existingTask, mode}: {existingTask?: EnergyItem, mode: 'create' | 'edit'}) {
    const [title, setTitle] = useState(existingTask ? existingTask.name : "");
    const [description, setDescription] = useState(existingTask ? existingTask.description : "");
    const [deadline, setDeadline] = useState(existingTask? existingTask.deadline : new Date());
    const [energy, setEnergy] = useState(existingTask ? existingTask.energyLevel : 0);
    const [dependency, setDependency] = useState<string[]>(existingTask ? existingTask.dependencies : []);
    const [items, setItems] = useState<EnergyItem[]>([]);

    useEffect(() => {
        const load = async () => {
            const [i] = await Promise.all([getAll()]);
            setItems(i);
        }
        load();
    }, []);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!title.trim()) {
            // TODO: 
            return;
        }

        if (!description.trim()) {
            // TODO: 
            return;
        }


        if (!deadline) {
            // TODO:
            return;
        }

        if (mode === 'edit' && existingTask) {
            await updateItem(existingTask.id, {name: title, category: existingTask.category, description: description, createdAt: new Date(), deadline: deadline, energyLevel: energy, dependencies: dependency});
        }
        else{
            await createItem({name: title, category: "Backlog", description: description, createdAt: new Date(), deadline: deadline, energyLevel: energy, dependencies: dependency});
        }
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

                    <DependencyFormInput label="Dependency" selectedItems={dependency} setSelectedItems={setDependency} availableItems={items.filter(item => item.id !== existingTask?.id).map(item => item.name)}/>

                    <IconButton onClick={handleSubmit} sx={{position: "absolute", bottom: 24, right: 24, bgcolor: "primary.main", color: "white", width: 48, height: 48,
                        "&:hover": { bgcolor: "primary.dark"},
                        "&:disabled": {bgcolor: "grey.400", color: "grey.600"}
                    }}>
                        {mode === 'edit' ? <SaveIcon /> : <AddIcon />}
                    </IconButton>
                </Stack>
            </Box>
        </Box>
    );
}