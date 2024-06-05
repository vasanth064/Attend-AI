import MachineList from '@/redux/machine/MachineList';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CreateMachine from '@/redux/machine/CreateMachine';

const Machines = () => {
  const [dialogStatus, setDialogStatus] = useState<boolean>(false);
  function toggleDialogStatus() {
    setDialogStatus(!dialogStatus);
  }
  return (
    <div>
      <Dialog open={dialogStatus} onOpenChange={toggleDialogStatus}>
        <div className='flex justify-between items-center py-4'>
          <h1 className='text-2xl font-bold'>Machines</h1>
          <DialogTrigger asChild>
            <Button variant='default' size='sm' onClick={toggleDialogStatus}>
              Create Machine
            </Button>
          </DialogTrigger>
        </div>
        <MachineList />
        <CreateMachine toggleDialogStatus={toggleDialogStatus} />
      </Dialog>
    </div>
  );
};

export default Machines;
