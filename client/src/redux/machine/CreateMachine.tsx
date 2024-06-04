import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateMachineMutation } from './machineApiSlice';

const CreateMachine = ({
  toggleDialogStatus,
}: {
  toggleDialogStatus: () => void;
}) => {
  const [createMachine, { isLoading }] = useCreateMachineMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createMachine({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      if (res?.data) {
        toggleDialogStatus();
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <DialogContent className='sm:max-w-[425px]'>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create Machine</DialogTitle>
          <DialogDescription>
            Create a new machines for your organization.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Machine Name
            </Label>
            <Input id='name' className='col-span-3' name='name' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='email' className='text-right'>
              Email Address
            </Label>
            <Input
              id='email'
              className='col-span-3'
              type='email'
              name='email'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='password' className='text-right'>
              Password
            </Label>
            <Input
              id='password'
              className='col-span-3'
              type='password'
              name='password'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={toggleDialogStatus}>
            Cancel
          </Button>

          <Button type='submit' disabled={isLoading}>
            Create Machine
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreateMachine;
