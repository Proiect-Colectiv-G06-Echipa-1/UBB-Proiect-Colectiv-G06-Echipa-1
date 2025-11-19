import Box from "@mui/material/Box";
import { TopNav } from "../components/TopNav";
import { useState } from "react";
import notesIcon from "../assets/notes.png"
import treeIcon from "../assets/tree.png"
import TaskCard from "../components/TaskDetails/TaskCard";
import { useParams } from "react-router-dom";

export function TaskDetailPage() {
  const [energyLevel, setEnergyLevel] = useState(6);

  const {id} = useParams<{id: string}>();

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" bgcolor={"#9FAFFF"}>
            <TopNav
                energyLevel={energyLevel}
                onDecrease={() => setEnergyLevel(prev => Math.max(0, prev - 1))}
                onIncrease={() => setEnergyLevel(prev => Math.min(10, prev + 1))}
            />
            
            <Box sx={{ display: 'flex', flex: 1, position: 'relative', overflow: 'auto'}}>
                <Box sx={{ width: '600px', display: 'flex', flexDirection: 'column', paddingTop: 2}}>
                    <Box sx={{ px: 3, pb: 2 }}>
                        <img src={notesIcon} alt="Notes" height={60} width={60}/>
                    </Box>
                    <Box sx={{ flex: 1,display: 'flex', alignItems: 'center', justifyContent: 'center', paddingRight: 2}}>
                        <TaskCard id={Number(id)} />
                    </Box>
                </Box>

                <Box sx={{width: '2px', bgcolor: '#000000', alignSelf: 'stretch'}} />

                <Box sx={{ paddingTop: 2}}>
                    <Box sx={{ px: 3, pb: 2 }}>
                        <img src={treeIcon} alt="Tree" height={60} width={60} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}