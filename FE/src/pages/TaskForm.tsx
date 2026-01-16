/**
 * @file TaskForm.tsx
 * @brief Page component for creating or editing a task.
 */
import Box from "@mui/material/Box";
import Form from "../components/ManageTask/Form";

/**
 * @brief TaskForm component that wraps the task management form.
 * @return The rendered TaskForm page.
 */
export default function TaskForm() {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 'var(--navbar-height)',
        left: 0,
        width: "100vw",
        height: "calc(100vh - var(--navbar-height))",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#9FAFFF",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <Form />
    </Box>
  );
}