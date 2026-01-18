import { Button } from '@/components/ui/button';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import YardIcon from '@mui/icons-material/Yard';
import BarChartIcon from '@mui/icons-material/BarChart';
import { Link, useLocation } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function MenuButton() {
    const location = useLocation();

    const items = [
      { to: '/profile', label: 'Profile', Icon: AccountCircleIcon },
      { to: '/plants', label: 'Your Plants', Icon: YardIcon },
      { to: '/charts', label: 'Charts', Icon: BarChartIcon },
    ];

    // Hide the item if we're on that route (exact) or a sub-route of it
    const visibleItems = items.filter(
      (i) => !(location.pathname === i.to || location.pathname.startsWith(i.to + '/'))
    );

    return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild><Button className='fixed left-4 sm:left-6 bottom-4 sm:bottom-6 bg-(--kitty-dark-pink) shadow-lg w-12 h-12 sm:w-15 sm:h-10 rounded-xl z-10'><MenuOpenIcon/></Button></DropdownMenuTrigger> 
                <DropdownMenuContent className='bg-(--kitty-light-pink)' side='bottom' align='start' sideOffset={5}>
                    <DropdownMenuLabel>Menu</DropdownMenuLabel>
                    <DropdownMenuSeparator /> 
                    {visibleItems.map(({ to, label, Icon }) => (
                      <Link key={to} to={to}>
                        <DropdownMenuItem className='justify-between'>
                          {label} <Icon className='text-black'/>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
    );
}

export default MenuButton;