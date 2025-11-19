import { IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

export default function StringFormInput({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
    return (
        <TextField id="filled-basic" label={label} variant="filled"
            InputLabelProps={{
                shrink: true
            }}
            InputProps={{
                disableUnderline: true,
                endAdornment: (
                    <IconButton onClick={() => setValue("")} size="small" sx = {{ color: "#666" }}>
                        <ClearIcon fontSize="small" />
                    </IconButton>
                )
            }}
            sx={{
                "& .MuiFilledInput-root": {
                    bgcolor: "#ece6f0",
                    border: 1,
                    borderRadius: 4,
                    borderColor: "black"
                },
                "& .MuiInputLabel-root": {
                    color: "black",
                },
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            fullWidth
        />
    )
}