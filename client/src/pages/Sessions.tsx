import SessionsList from '@/redux/sessions/SessionsList';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CreateSession from '@/redux/sessions/CreateSession';
import { useState } from 'react';

const Sessions = () => {
  const [dialogStatus, setDialogStatus] = useState<boolean>(false);
  function toggleDialogStatus() {
    setDialogStatus(!dialogStatus);
  }
  return (
    <div>
      <Dialog open={dialogStatus} onOpenChange={toggleDialogStatus}>
        <div className='flex justify-between items-center py-4'>
          <h1 className='text-2xl font-bold'>Sessions</h1>
          <DialogTrigger asChild>
            <Button variant='default' size='sm' onClick={toggleDialogStatus}>
              Create Session
            </Button>
          </DialogTrigger>
        </div>
        <SessionsList />
        <CreateSession toggleDialogStatus={toggleDialogStatus} />
      </Dialog>
    </div>
  );
};

export default Sessions;
