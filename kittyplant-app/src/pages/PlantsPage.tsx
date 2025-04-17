import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import "../styles/PlantsPage.css"
import WaterLevel from '../components/WaterLevel';
import { useState } from 'react';

function PlantsPage() {
  const [waterLevel, setWaterLevel] = useState<number | null>(null);

  useState(() => {
    setWaterLevel(60);
  });

  const handleAddDevice = () => {
    console.log("Add device")
  }

  return (
    <div className="tmp-plant">
      <Header />
      <div className="plants-page">
          <div className="plant-card">
            <WaterLevel waterLevel={waterLevel ?? 0} name="Plant 1"/>
            <WaterLevel waterLevel={waterLevel ?? 0} name="Plant 1"/>
            <WaterLevel waterLevel={waterLevel ?? 0} name="Plant 1"/>
            {/* <WaterLevel waterLevel={waterLevel ?? 0} name="Plant 1"/>
            <WaterLevel waterLevel={waterLevel ?? 0} name="Plant 1"/> */}
          </div>
        <button className='btn-options'><AddIcon/></button>
        <button className='btn-add-device' onClick={handleAddDevice}><AddIcon/> Add device</button>
      </div>
    </div>
  );
}

export default PlantsPage;