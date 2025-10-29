import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import MenuButton from '../components/MenuButton';
import WaterLevel from '../components/WaterLevel';
import { useState, useEffect } from 'react';
import axios from 'axios';
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function PlantsPage() {
  const [waterLevels, setWaterLevels] = useState<number[]>([]);
  const [deviceName, setDeviceName] = useState<string[]>([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newID, setID] = useState('');
  const [newDevicePlant, setNewDevicePlant] = useState('');
  const [plantsName, setPlantsName] = useState<string[]>([]);
  const [isCustomPlant, setIsCustomPlant] = useState(false);
  const [customPlantName, setCustomPlantName] = useState('');
  const [customWaterLevels, setCustomWaterLevels] = useState<[number, number]>([0, 100]);

  const handleUpdateWaterLevel = () =>{
    try{
      axios.get('/api/v1/devices', { withCredentials: true })
      .then((response) => {
        const levels = response.data.devices.map((device: any) => device.waterLevel);
        setWaterLevels(levels);
        const name = response.data.devices.map((device: any) => device.name);
        setDeviceName(name);
        console.log(response.data)
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
      try{
      axios.get('/api/v1/plants' , { withCredentials: true })
      .then((response) => {
        const plants = response.data.plants.map((plant: any) => plant.name);
        setPlantsName(plants)
      })
    }catch(error) {
      console.error("Error fetching plants:", error);
    }
  };

  const handleSubmitNewDevice = () => {
    const newDevice: any = {
      device_id: newID,
      name: newDeviceName,
      plant: isCustomPlant ? customPlantName : newDevicePlant,
    };

    if (isCustomPlant) {
      newDevice.water_level_min = customWaterLevels[0];
      newDevice.water_level_max = customWaterLevels[1];
    }

    console.log('New device data:', newDevice);

    axios
      .post('/api/v1/devices', newDevice, { withCredentials: true })
      .then((response) => {
        console.log('Device added:', response.data);
        handleUpdateWaterLevel();
      })
      .catch((error) => {
        console.error('Error adding device:', error);
      });
  };

  return (
    <div className="h-full">
      <Header />
      <div className="h-full w-full">
          <div className="w-4/5 flex flex-wrap justify-center mx-auto my-5">
          {deviceName.map((name, index) => (
            <WaterLevel key={index} waterLevel={waterLevels[index]} name={name} />
          ))}
          </div>
        <MenuButton />
        <Dialog>
          <DialogTrigger><Button className='fixed right-6 bottom-6 bg-(--kitty-dark-pink) shadow-lg w-15 h-10 rounded-xl'><AddIcon/></Button></DialogTrigger>
          <DialogContent className='bg-(--kitty-light-pink) w-[400px]'>
            <DialogHeader>
              <DialogTitle>Add new device</DialogTitle>
              <DialogDescription>
                <Label className='m-4'>Device ID</Label>
                <Input value={newID} onChange={(e) => setID(e.target.value)} className='bg-(--kitty-white)' placeholder='kp-0000'/>
                <Label className='m-4'>Device Custom Name</Label>
                <Input value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} className='bg-(--kitty-white)' placeholder='Super Cute Plant'/>
                <Label className='m-4'>Pick you plant</Label>
                <Select>
                  <SelectTrigger className="w-full bg-(--kitty-white)">
                    <SelectValue placeholder="Select a plant" />
                  </SelectTrigger>
                  <SelectContent className='bg-(--kitty-light-pink)'>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
                <div className='flex items-center m-6'>
                  <Checkbox className='bg-(--kitty-white)' checked={isCustomPlant} onCheckedChange={checked => setIsCustomPlant(checked === true)}/>
                  <Label className='ml-2'>Custom Plant</Label>
                </div>
                {isCustomPlant && (
                  <>
                    <Label className='m-4'>Custom Plant Name</Label>
                    <Input value={customPlantName} onChange={(e) => setCustomPlantName(e.target.value)} className='bg-(--kitty-white)' placeholder='My Unique Plant'/>
                    <Label className='m-4'>Custom Water Levels</Label>
                    <Slider value={customWaterLevels} onValueChange={value => setCustomWaterLevels(value as [number, number])} min={0} max={100} step={5} defaultValue={[30, 60]} className='[&_[role=slider]]:bg-(--kitty-dark-pink) [&_[role=slider]]:border-pink-500 [&>span:first-child]:bg-(--kitty-white) [&>span:first-child>span]:bg-(--kitty-dark-pink) m-4'/>
                  </>
                )}

              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" className='bg-(--kitty-dark-pink)'>Save changes</Button>
           </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <img src={leaftoplfet} alt="Leaf Top Left" className="fixed -z-5 h-auto w-1/5 top-0 left-0"/>
      <img src={leaftopright} alt="Leaf Top Right" className="fixed -z-5 h-auto w-1/5 top-0 right-0"/>
    </div>
  );
}

export default PlantsPage;