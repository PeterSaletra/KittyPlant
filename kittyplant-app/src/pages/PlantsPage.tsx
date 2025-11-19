import Header from '../components/Header'
import AddIcon from '@mui/icons-material/Add';
import MenuButton from '../components/MenuButton';
import WaterLevel from '../components/WaterLevel';
import { useState, useEffect } from 'react';
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'
import { getDevices, addDevice, type NewDevice } from '@/lib/devices';
import { getPlants } from '@/lib/plants';
import { toast } from 'sonner';
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
  const [waterLevels, setWaterLevels] = useState<number[]>([75, 45, 60, 20]);
  const [moistureLevels, setMoistureLevels] = useState<number[]>([65, 40, 55, 15]);
  const [lastWatered, setLastWatered] = useState<string[]>([]);
  const [deviceName, setDeviceName] = useState<string[]>([]);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newID, setID] = useState('');
  const [newDevicePlant, setNewDevicePlant] = useState('');
  const [plantsName, setPlantsName] = useState<string[]>([]);
  const [isCustomPlant, setIsCustomPlant] = useState(false);
  const [customPlantName, setCustomPlantName] = useState('');
  const [customWaterLevels, setCustomWaterLevels] = useState<[number, number]>([0, 100]);

  const handleUpdateWaterLevel = async () => {
    try {
      const response = await getDevices();
      console.log(response);
      if (!response.devices || response.devices.length === 0) {
        setWaterLevels([]);
        setDeviceName([]);
        return;
      }
      const levels = response.devices.map((device: any) => device.waterLevel);
      setWaterLevels(levels);
      const moisture = response.devices.map((device: any) => device.moistureLevel);
      setMoistureLevels(moisture); 
      const name = response.devices.map((device: any) => device.name);
      setDeviceName(name);
    } catch (error) {
      console.error("Error fetching water level:", error);
      toast.error("Failed to fetch devices");
    }
  }

  const handleGetPlants = async () => {
    try {
      const response = await getPlants();
      const plants = response.plants.map((plant: any) => plant.name);
      setPlantsName(plants);
    } catch (error) {
      toast.error("Failed to fetch plants");
    }
  };

  useEffect(() => {
    handleUpdateWaterLevel();
    handleGetPlants();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      handleUpdateWaterLevel();
    }, 5000);
    return () => clearInterval(interval);
    }
  , []);



  const handleSubmitNewDevice = async () => {
    const newDevice: NewDevice = {
      device_id: newID,
      name: newDeviceName,
      plant: isCustomPlant ? customPlantName : newDevicePlant,
    };

    if (isCustomPlant) {
      newDevice.water_level_min = customWaterLevels[0];
      newDevice.water_level_max = customWaterLevels[1];
    }

    try {
      await addDevice(newDevice);
      toast.success("Device added successfully!");
      handleUpdateWaterLevel();
      // Reset form
      setNewDeviceName('');
      setID('');
      setNewDevicePlant('');
      setIsCustomPlant(false);
      setCustomPlantName('');
      setCustomWaterLevels([0, 100]);
    } catch (error) {
      console.error('Error adding device:', error);
      toast.error("Failed to add device");
    }
  };

  return (
    <div className="h-full">
      <Header />
      <div className="h-full w-full">
          <div className="w-4/5 flex flex-wrap justify-center mx-auto my-5">
          {deviceName.map((name, index) => (
            <WaterLevel 
              key={index} 
              waterLevel={waterLevels[index]} 
              moistureLevel={moistureLevels[index]} 
              lastTimeWatered={lastWatered[index]} 
              name={name} 
            />
          ))}
          </div>
        <MenuButton />
        <Dialog>
          <DialogTrigger><Button className='fixed right-6 bottom-6 bg-(--kitty-dark-pink) shadow-lg w-15 h-10 rounded-xl'><AddIcon/></Button></DialogTrigger>
          <DialogContent className='bg-(--kitty-light-pink) w-[400px]'>
            <DialogHeader>
              <DialogTitle>Add new device</DialogTitle>
              <DialogDescription>
                <Label className='my-4'>Device ID</Label>
                <Input value={newID} onChange={(e) => setID(e.target.value)} className='bg-(--kitty-white)' placeholder='kp-0000'/>
                <Label className='my-4'>Device Custom Name</Label>
                <Input value={newDeviceName} onChange={(e) => setNewDeviceName(e.target.value)} className='bg-(--kitty-white)' placeholder='Super Cute Plant'/>
                <Label className='my-4'>Pick you plant</Label>
                <Select value={newDevicePlant} onValueChange={setNewDevicePlant}>
                  <SelectTrigger className="w-full bg-(--kitty-white)">
                    <SelectValue placeholder="Select a plant" />
                  </SelectTrigger>
                  <SelectContent className='bg-(--kitty-light-pink)'>
                    {plantsName.map((plant, index) => (
                      <SelectItem key={index} value={plant}>{plant}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className='flex items-center m-6'>
                  <Checkbox className='bg-(--kitty-white)' checked={isCustomPlant} onCheckedChange={checked => setIsCustomPlant(checked === true)}/>
                  <Label className='ml-2'>Custom Plant</Label>
                </div>
                {isCustomPlant && (
                  <>
                    <Label className='my-4'>Custom Plant Name</Label>
                    <Input value={customPlantName} onChange={(e) => setCustomPlantName(e.target.value)} className='bg-(--kitty-white)' placeholder='My Unique Plant'/>
                    <Label className='my-4'>Custom Water Levels</Label>
                    Current Range: {customWaterLevels[0]}% - {customWaterLevels[1]}%
                    <Slider value={customWaterLevels} onValueChange={value => setCustomWaterLevels(value as [number, number])} min={0} max={100} step={5} defaultValue={[30, 60]} className='[&_[role=slider]]:bg-(--kitty-dark-pink) [&_[role=slider]]:border-pink-500 [&>span:first-child]:bg-(--kitty-white) [&>span:first-child>span]:bg-(--kitty-dark-pink) my-5'/>
                  </>
                )}

              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button type="submit" onClick={handleSubmitNewDevice} className='bg-(--kitty-dark-pink)'>Save changes</Button>
              </DialogClose>
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