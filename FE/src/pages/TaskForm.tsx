import { useState } from "react";
import { TopNav } from "../components/TopNav";
import Box from "@mui/material/Box";
import Form from "../components/ManageTask/Form";

export default function TaskForm() {
  const [energyLevel, setEnergyLevel] = useState(6);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#9FAFFF",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <TopNav
        energyLevel={energyLevel}
        onDecrease={() => setEnergyLevel((prev) => Math.max(0, prev - 1))}
        onIncrease={() => setEnergyLevel((prev) => Math.min(10, prev + 1))}
      />
      <Form />
    </Box>
  );
}