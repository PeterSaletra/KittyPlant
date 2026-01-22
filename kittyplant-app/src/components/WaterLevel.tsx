import waterLevel20 from '../assets/waterLevel20.png';
import waterLevel40 from '../assets/waterLevel40.png';
import waterLevel60 from '../assets/waterLevel60.png';
import waterLevel80 from '../assets/waterLevel80.png';
import waterLevel100 from '../assets/waterLevel100.png';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import DeleteDeviceButton from './DeleteDeviceButton';
import CommandButton from './CommandButton';

interface WaterLevelProps {
    waterLevel: number;
    moistureLevel: number;
    lastTimeWatered: string;
    name: string;
    plant: string;
    device_id: string;
    onDelete: () => void;
}

const WaterLevel: React.FC<WaterLevelProps> = ({ waterLevel, moistureLevel, lastTimeWatered, name, plant, device_id, onDelete }) => {
    const formatLastWatered = (isoString: string) => {
        if (!isoString) return 'Never';
        
        const date = new Date(isoString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return date.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    };

    return (
        <div className="w-full sm:w-1/2 lg:w-1/3 xl:w-1/4 p-3">
            <Card className="bg-(--kitty-light-pink) border-2 border-(--kitty-white) hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-medium flex items-center justify-between">
                        <div>
                             {name}
                        </div>
                        <div>
                            <CommandButton device_id={device_id}/>
                            <DeleteDeviceButton onDelete={onDelete}/>    
                        </div>                             
                        </CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                        <p>Device ID: {device_id}</p>
                        <p>Plant: {plant}</p>
                        Last time watered: {formatLastWatered(lastTimeWatered)}
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                    <div className="w-full max-w-[300px] mb-4">
                        {
                        waterLevel <= 20 ? (
                            <img src={waterLevel20} alt="Water Level 20%" className="w-full h-auto" />
                        ) : waterLevel <= 40 ? (
                            <img src={waterLevel40} alt="Water Level 40%" className="w-full h-auto" />
                        ) : waterLevel <= 60 ? (
                            <img src={waterLevel60} alt="Water Level 60%" className="w-full h-auto" />
                        ) : waterLevel <= 80 ? (
                            <img src={waterLevel80} alt="Water Level 80%" className="w-full h-auto" />
                        ) : (
                            <img src={waterLevel100} alt="Water Level 100%" className="w-full h-auto" />
                        )}
                    </div>
                    <div className="w-full space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Water Level:</span>
                            <span className="text-sm font-bold text-(--kitty-dark-pink)">{waterLevel}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Moisture Level:</span>
                            <span className="text-sm font-bold text-(--kitty-crayola)">{moistureLevel}%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default WaterLevel;