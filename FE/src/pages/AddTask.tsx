import { useState } from "react";
import { Box } from "@mui/material";
import { TopNav } from "../components/TopNav";
import Form from "../components/Add/Form";

export default function AddTask() {
    const [energyLevel, setEnergyLevel] = useState(6);

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor={"#9FAFFF"}>
            <TopNav
                energyLevel={energyLevel}
                onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
                onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
            />
            <Form/>
        </Box>
    )
}