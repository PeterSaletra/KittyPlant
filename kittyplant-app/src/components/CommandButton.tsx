import SettingsRemoteIcon from '@mui/icons-material/SettingsRemote';
import { Droplets, Power, MapPin } from 'lucide-react';
import { sendCommands } from '@/lib/devices';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const CommandButton: React.FC<{ device_id: string}> = ({ device_id}) => {

    const items = [
        { command: 'water', label: 'Water Now', Icon: Droplets },
        { command: "restart", label: "Restart Device", Icon: Power },
        { command: "find", label: "Find Device", Icon: MapPin },
    ]

    const handleCommand = async (command: string) => {   
         await sendCommands(command, device_id);
    }
    
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SettingsRemoteIcon className='text-(--kitty-dark-pink) hover:text-(--kitty-crayola) cursor-pointer'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-(--kitty-light-pink)' side='bottom' align='start' sideOffset={5}>
                <DropdownMenuLabel>Commands</DropdownMenuLabel>
                <DropdownMenuSeparator /> 
                {items.map(({ command, label, Icon }) => (
                    <DropdownMenuItem key={label} className='justify-between' onClick={() => handleCommand(command)}>
                      <Icon className='text-black'/> {label} 
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CommandButton;