import Box from "@mui/material/Box";
import Form from "../components/ManageTask/Form";

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