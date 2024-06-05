import { Button } from '@/components/ui/button';
import InvitesList from '@/redux/invite/InvitesList';
import { Link } from 'react-router-dom';

const Invites = () => {
  return (
    <div>
      <div className='flex justify-between items-center py-4'>
        <h1 className='text-2xl font-bold'>Invite Links</h1>
        <Button variant='default' size='sm' asChild>
          <Link to='/client/invites/create'>Create Invite Link</Link>
        </Button>
      </div>
      <InvitesList />
    </div>
  );
};

export default Invites;
