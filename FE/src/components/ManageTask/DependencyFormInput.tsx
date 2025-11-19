import { useState } from "react";
import {TextField, Box, Chip, Paper, List, ListItem, ListItemButton, ListItemText, IconButton} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";
import type { TaskDTO } from "../../../typescript-client";

export interface DependencyFormInputProps {
    label: string;
    allTasks: TaskDTO[];
    selectedTasksDependencies: TaskDTO[];
    setSelectedTasksDependencies: (tasks: TaskDTO[]) => void;
}


export default function DependencyFormInput({label, selectedTasksDependencies, setSelectedTasksDependencies, allTasks}: DependencyFormInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredItems = allTasks.filter((task) => {
        if (task.title !== undefined) {
            return task.title.toLowerCase().includes(inputValue.toLowerCase()) && !selectedTasksDependencies.includes(task);
        }
        return false;
    });

    const handleSelectTask = (task: TaskDTO) => {
         setSelectedTasksDependencies([...selectedTasksDependencies, task]);
         setInputValue("");
         setShowSuggestions(false);
    };

    const handleRemoveTask = (taskToRemove: TaskDTO) => {
         setSelectedTasksDependencies(selectedTasksDependencies.filter((task) => task !== taskToRemove));
    };

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setShowSuggestions(e.target.value.length > 0);
    }

    const onFocus = () => {
        if (inputValue.length > 0) setShowSuggestions(true);
    }

    const onBlur = () => {
        setTimeout(() => setShowSuggestions(false), 200);
    }

    return (
        <Box sx={{ position: "relative", width: "100%" }}>
            <TextField label={label} variant="filled" value={inputValue} onChange={onChange} onFocus={onFocus} onBlur={onBlur} InputLabelProps={{ shrink: true }}
                InputProps={{ disableUnderline: true, endAdornment: (
                    <IconButton onClick={() => setInputValue("")} size="small"sx={{ color: "#666" }}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                    )}}
                sx={{"& .MuiFilledInput-root": {bgcolor: "#ece6f0", border: 1, borderRadius: 4, borderColor: "black"}, "& .MuiInputLabel-root": {color: "black"}}} fullWidth/>
            {showSuggestions && filteredItems.length > 0 && (
                <Paper sx={{position: "absolute", top: "100%", left: 0, right: 0, zIndex: 1000, maxHeight: "200px", overflowY: "auto", mt: 1, border: 1, borderColor: "black", borderRadius: 2}}>
                    <List disablePadding>
                        {filteredItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => handleSelectTask(item)}>
                                    <ListItemText primary={item.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )}

            {selectedTasksDependencies.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2}}>
                    {selectedTasksDependencies.map((item, index) => (
                        <Chip key={index} label={item.title} onDelete={() => handleRemoveTask(item)} deleteIcon={<CancelIcon />}
                            sx={{ bgcolor: "#7c3aed", color: "white", borderRadius: "20px", "& .MuiChip-deleteIcon": { color: "white", "&:hover": { color: "#f3f4f6"}}}}/>
                    ))}
                </Box>
            )}
        </Box>
    );
}