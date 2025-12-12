import DeleteIcon from '@mui/icons-material/Delete';
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
import { Button } from './ui/button';
import { deleteDevice } from '@/lib/devices';
import { toast } from 'sonner';

const DeleteDeviceButton: React.FC<{ device_id: string }> = ({ device_id }) => {

    const handleDelete = () => {
        try{
            deleteDevice(device_id);
            toast.success('Device deleted successfully');
        }catch (error) {
            toast.error(`Error deleting device: ${error}`);
        }
    }


    return (
        <Dialog>
            <DialogTrigger>
                <DeleteIcon className='text-(--kitty-dark-pink) hover:text-(--kitty-crayola) cursor-pointer'/>
            </DialogTrigger>
            <DialogContent className='bg-(--kitty-light-pink) w-[400px]'>
                <DialogHeader>
                    <DialogTitle>Delete Device</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this device? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" className="mr-2">Cancel</Button>
                    </DialogClose>
                    <Button className="bg-(--kitty-dark-pink) text-white px-4 py-2 rounded hover:bg-(--kitty-crayola)" onClick={handleDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDeviceButton;