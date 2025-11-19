import { useState } from "react";
import {TextField, Box, Chip, Paper, List, ListItem, ListItemButton, ListItemText, IconButton} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import ClearIcon from "@mui/icons-material/Clear";

export default function DependencyFormInput({label, selectedItems, setSelectedItems, availableItems}: {label: string; selectedItems: number[]; setSelectedItems: (items: number[]) => void; availableItems: string[]}) {
    const [inputValue, setInputValue] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    //const filteredItems = availableItems.filter((item) => item.toLowerCase().includes(inputValue.toLowerCase()) &&!selectedItems.includes(item));

    const handleSelectItem = (item: number) => {
        // setSelectedItems([...selectedItems, item]);
        // setInputValue("");
        // setShowSuggestions(false);
    };

    const handleRemoveItem = (itemToRemove: number) => {
        // setSelectedItems(selectedItems.filter((item) => item !== itemToRemove));
    };

    return (
        <Box sx={{ position: "relative", width: "100%" }}>
            <TextField
                label={label}
                variant="filled"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => {
                    if (inputValue.length > 0) setShowSuggestions(true);
                }}
                onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                }}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    disableUnderline: true,
                    endAdornment: (
                        <IconButton 
                            onClick={() => setInputValue("")}
                            size="small"
                            sx={{ color: "#666" }}
                        >
                            <ClearIcon fontSize="small" />
                        </IconButton>
                    )
                }}
                sx={{
                    "& .MuiFilledInput-root": {
                        bgcolor: "#ece6f0",
                        border: 1,
                        borderRadius: 4,
                        borderColor: "black",
                    },
                    "& .MuiInputLabel-root": {
                        color: "black",
                    },
                }}
                fullWidth
            />

            {/* {showSuggestions && filteredItems.length > 0 && (
                <Paper
                    sx={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                        mt: 1,
                        border: 1,
                        borderColor: "black",
                        borderRadius: 2,
                    }}
                >
                    <List disablePadding>
                        {filteredItems.map((item, index) => (
                            <ListItem key={index} disablePadding>
                                <ListItemButton onClick={() => handleSelectItem(item)}>
                                    <ListItemText primary={item} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            )} */}

            {selectedItems.length > 0 && (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mt: 2,
                    }}
                >
                    {selectedItems.map((item, index) => (
                        <Chip
                            key={index}
                            label={item}
                            onDelete={() => handleRemoveItem(item)}
                            deleteIcon={<CancelIcon />}
                            sx={{
                                bgcolor: "#7c3aed",
                                color: "white",
                                borderRadius: "20px",
                                "& .MuiChip-deleteIcon": {
                                    color: "white",
                                    "&:hover": {
                                        color: "#f3f4f6",
                                    },
                                },
                            }}
                        />
                    ))}
                </Box>
            )}
        </Box>
    );
}