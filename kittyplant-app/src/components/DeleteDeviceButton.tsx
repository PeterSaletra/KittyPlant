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

const DeleteDeviceButton: React.FC<{ onDelete: () => void }> = ({ onDelete }) => {
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
                    <Button className="bg-(--kitty-dark-pink) text-white px-4 py-2 rounded hover:bg-(--kitty-crayola)" onClick={onDelete}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteDeviceButton;