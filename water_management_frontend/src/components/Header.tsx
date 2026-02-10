
import {Droplets, LogOut} from 'lucide-react';
import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Button} from './ui/button';

export function Header() {
    const { user, logout} = useAuth();

    const handleLogout = async () => {
        await logout();
    };

    return(
        <header className='sticky top-0 z-50 border0b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="container flex h-16 items-center justify-between px-4">
                <Link to="/dashboard" className='flex items-center gap-2'>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Droplets className='h-5 w-5 text-primary'></Droplets>
                    </div>
                    <span className='text-lg font-semibold text-foreground'>Water Tracker</span>
                </Link>

                <div className="flex items-center gap-4">
                    {user && (
                        <>
                        <span className="hidden text-sm text-muted-foreground sm-inline">
                            Hello, {user.name}
                        </span>
                        <Button variant='ghost' size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4">
                                LogOut
                            </LogOut>
                        </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}