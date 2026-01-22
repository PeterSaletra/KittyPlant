import Header from '../components/Header'
import MenuButton from '../components/MenuButton'
import leaftoplfet from '../assets/leaftopleft.png'
import leaftopright from '../assets/leaftopright.png'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { useEffect, useState } from 'react'
import { getUserDetail } from '@/lib/users'
import { toast } from 'sonner'


function ProfilePage() {
    const [userData, setUserData] = useState<{
        id: number,
        username: string,
        created_at: string,
        updated_at: string,
        devices_count: number
    }>();

    const [editData, setEditData] = useState<typeof userData>(undefined);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const formatDate = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleGetUserData = async () => {
        try{
            const response = await getUserDetail();
            setUserData(response); 
        }catch(error){
            toast.error(`Error occured while fetching user data: ${error}`)
        }
    }

    useEffect(() => {
        handleGetUserData();
    }, [])

    const handleUpdateProfile = () => {
        setUserData(editData);
        console.log('Profile updated:', editData);
        
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('Nowe hasło i potwierdzenie nie są zgodne!');
            return;
        }
        console.log('Password change requested');
        
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };

    return (
        <div className="min-h-screen">
            <Header />
            
            <div className="max-w-3xl mx-auto mt-5 px-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Profil użytkownika</CardTitle>
                        <CardDescription>Zarządzaj swoimi danymi osobowymi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Dane osobowe */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Dane osobowe</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Username:</Label>
                                    <p className="text-base mt-1">{userData?.username}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Created account at</Label>
                                    <p className="text-base mt-1">{userData?.created_at ? formatDate(userData.created_at) : '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Last update</Label>
                                    <p className="text-base mt-1">{userData?.updated_at ? formatDate(userData.updated_at) : '-'}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">Number of devices</Label>
                                    <p className="text-base mt-1">{userData?.devices_count}</p>
                                </div>
                            </div>
                        </div>

                        {/* Przyciski akcji */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            {/* Dialog edycji danych */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="flex-1">
                                        Edytuj dane
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-(--kitty-light-pink) sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Edytuj dane użytkownika</DialogTitle>
                                        <DialogDescription>
                                            Zaktualizuj swoje dane osobowe
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="firstName">Username</Label>
                                            <Input
                                                id="firstName"
                                                value={editData?.username}
                                                onChange={(e) => setEditData(editData ? {...editData, username: e.target.value} : undefined)}
                                                className='bg-(--kitty-white)'
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline" className='bg-(--kitty-dark-pink) text-white'>Anuluj</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={handleUpdateProfile}>
                                                Zapisz zmiany
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>

                            {/* Dialog zmiany hasła */}
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="bg-(--kitty-dark-pink) text-white flex-1">
                                        Zmień hasło
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-(--kitty-light-pink) sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Zmień hasło</DialogTitle>
                                        <DialogDescription>
                                            Wprowadź obecne hasło oraz nowe hasło
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="currentPassword">Obecne hasło</Label>
                                            <Input
                                                id="currentPassword"
                                                type="password"
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                                                className='bg-(--kitty-white)'
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="newPassword">Nowe hasło</Label>
                                            <Input
                                                id="newPassword"
                                                type="password"
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                                className='bg-(--kitty-white)'
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="confirmPassword">Potwierdź nowe hasło</Label>
                                            <Input
                                                id="confirmPassword"
                                                type="password"
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                                className='bg-(--kitty-white)'
                                            />
                                        </div>
                                    </div>
                                    <DialogFooter className='flex-col sm:flex-row gap-2'>
                                        <DialogClose asChild>
                                            <Button variant="outline" className='bg-(--kitty-dark-pink) text-white w-full sm:w-auto'>Anuluj</Button>
                                        </DialogClose>
                                        <DialogClose asChild>
                                            <Button onClick={handleChangePassword} className='w-full sm:w-auto'>
                                                Zmień hasło
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <MenuButton />
            <img src={leaftoplfet} alt="Leaf Top Left" className="hidden sm:block fixed -z-5 h-auto w-1/5 top-0 left-0"/>
            <img src={leaftopright} alt="Leaf Top Right" className="hidden sm:block fixed -z-5 h-auto w-1/5 top-0 right-0"/>
        </div>
    );
}

export default ProfilePage;