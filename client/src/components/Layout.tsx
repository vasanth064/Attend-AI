import { CircleUser, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import {
  DropdownMenu,
  // DropdownMenuContent,
  // DropdownMenuItem,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { Toaster } from './ui/toaster';
import { routes } from '../config/routes';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/redux/authentication/authSlice';
import logo from '../assets/logo.jpeg';

const NavItems = () => {
  const { user } = useSelector(selectCurrentUser);
  const userType = user?.userType || 'USER';
  return routes.map(
    (route) =>
      route.roles.includes(userType) && (
        <Link
          to={route.path}
          key={route.title}
          className='text-foreground transition-colors hover:text-foreground'>
          {route.title}
        </Link>
      )
  );
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className='flex min-h-screen w-full flex-col'>
      <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
        <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
          <Link
            to='#'
            className='flex items-center gap-2 text-lg font-semibold md:text-base'>
            <img src={logo} alt='AttendAI' className='h-10 w-auto' />
            <span className='sr-only'>Attend AI</span>
          </Link>
          <NavItems />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='shrink-0 md:hidden'>
              <Menu className='h-5 w-5' />
              <span className='sr-only'>Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left'>
            <nav className='grid gap-6 text-lg font-medium'>
              <NavItems />
            </nav>
          </SheetContent>
        </Sheet>
        <div className='flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
          <form className='ml-auto flex-1 sm:flex-initial'></form>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='secondary' size='icon' className='rounded-full'>
                <CircleUser className='h-5 w-5' />
                <span className='sr-only'>Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            {/* <DropdownMenuContent align='end'>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent> */}
          </DropdownMenu>
        </div>
      </header>
      <main className='flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8'>
        <Toaster />
        {children}
      </main>
    </div>
  );
};

export default Layout;
