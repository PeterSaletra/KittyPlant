import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import "../styles/PlantsPage.css"
import WaterLevel from '../components/WaterLevel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

function PlantsPage() {
  const [waterLevels, setWaterLevels] = useState<number[]>([]);
  const [deviceName, setDeviceName] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDevicePlant, setNewDevicePlant] = useState('');
  const [plantsName, setPlantsName] = useState<string[]>([]);
  const [isCustomPlant, setIsCustomPlant] = useState(false);
  const [customPlantName, setCustomPlantName] = useState('');
  const [customWaterLevels, setCustomWaterLevels] = useState([0, 100]);

  const handleUpdateWaterLevel = () =>{
    try{
      axios.get('http://localhost:8080/api/devices')
      .then((response) => {
        const levels = response.data.devices.map((device: any) => device.waterLevel);
        setWaterLevels(levels);
        const name = response.data.devices.map((device: any) => device.name);
        setDeviceName(name);
      })
      }catch(error) {
        console.error("Error fetching water level:", error);
      }
  }

  useEffect(() => {
    handleUpdateWaterLevel();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleUpdateWaterLevel();
    }, 5000);
    return () => clearInterval(interval);
    }
  , []);

  const handleAddDevice = () => {
    setIsModalOpen(true); // Open the modal
      try{
      axios.get('http://localhost:8080/api/plants')
      .then((response) => {
        const plants = response.data.plants.map((plant: any) => plant.name);
        setPlantsName(plants)// Set the first plant as default
      })
    }catch(error) {
      console.error("Error fetching plants:", error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false); // Close the modal
  };

  const handleSubmitNewDevice = () => {
    // Example: Send new device data to the server
    const newDevice = {
      name: newDeviceName,
      plant: newDevicePlant,
      waterLevelMin: isCustomPlant ? customWaterLevels[0] : undefined,
      waterLevelMax: isCustomPlant ? customWaterLevels[1] : undefined,
      customPlant: isCustomPlant ? customPlantName : undefined,
    };

    axios
      .post('http://localhost:8080/api/devices', newDevice)
      .then((response) => {
        console.log('Device added:', response.data);
        handleUpdateWaterLevel(); // Refresh the device list
        setIsModalOpen(false); // Close the modal
      })
      .catch((error) => {
        console.error('Error adding device:', error);
      });
  };

  return (
    <div className="tmp-plant">
      <Header />
      <div className="plants-page">
          <div className="plant-card">
          {deviceName.map((name, index) => (
            <WaterLevel key={index} waterLevel={waterLevels[index]} name={name} />
          ))}
          </div>
        <button className='btn-options'><AddIcon/></button>
        <button className='btn-add-device' onClick={handleAddDevice}><AddIcon/> Add device</button>
      </div>
      <img src={leaftoplfet} alt="Leaf Top Left" className="leaf-decoration top-left"/>
      <img src={leaftopright} alt="Leaf Top Right" className="leaf-decoration top-right"/>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>ADD NEW DEVICE</h2>
            <label>
              DEVICE NAME
              <input
                type="text"
                value={newDeviceName}
                placeholder='DEVICE NAME'
                onChange={(e) => setNewDeviceName(e.target.value)}
              />
            </label>
            <label>
              PLANT
              <select
                value={newDevicePlant}
                onChange={(e) => setNewDevicePlant(e.target.value)}
                style={{ color: newDevicePlant ? 'black' : 'gray' }}
              >
                <option value="" style={{color : 'gray'}}>SELECT A PLANT</option>
                {plantsName.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <input 
                type="checkbox"
                checked={isCustomPlant}
                onChange={(e) => setIsCustomPlant(e.target.checked)}
              />
              ADD CUSTOM PLANT
            </label>
            {isCustomPlant && (
              <><label>
                CUSTOM PLANT NAME
                <input
                  type="text"
                  value={customPlantName}
                  placeholder='PLANT NAME'
                  onChange={(e) => setCustomPlantName(e.target.value)} />
              </label>
              <label>
                HYDRATION LEVEL
                <RangeSlider 
                  min={0} 
                  max={100} 
                  step={5}  
                  value={customWaterLevels}
                  onInput={setCustomWaterLevels}
                  />
                  {customWaterLevels[0]}% - {customWaterLevels[1]}%
              </label>
              </>
            )}
            <div className="modal-actions">
              <button onClick={handleSubmitNewDevice}>SUBMIT</button>
              <button onClick={handleModalClose}>CANCEL</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlantsPage;