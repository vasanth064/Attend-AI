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
import { useCreateSessionMutation } from './sessionsApiSlice';

const CreateSession = ({
  toggleDialogStatus,
}: {
  toggleDialogStatus: () => void;
}) => {
  const [createSession, { isLoading }] = useCreateSessionMutation();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      const res = await createSession({
        name: formData.get('name') as string,
        startDateTime: formData.get('startDate') as string,
        endDateTime: formData.get('endDate') as string,
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
          <DialogTitle>Create Session</DialogTitle>
          <DialogDescription>
            Create a new sessions for your organization.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input id='name' className='col-span-3' name='name' />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='startDate' className='text-right'>
              Start Date
            </Label>
            <Input
              id='startDate'
              className='col-span-3'
              name='startDate'
              type='datetime-local'
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='endDate' className='text-right'>
              End Date
            </Label>
            <Input
              type='datetime-local'
              id='endDate'
              className='col-span-3'
              name='endDate'
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant='outline' onClick={toggleDialogStatus}>
            Cancel
          </Button>

          <Button type='submit' disabled={isLoading}>
            Create Session
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreateSession;
