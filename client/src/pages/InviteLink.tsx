import FaceDetector from '@/components/FaceDetector';
import InviteForm from './InviteForm';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import React, { BaseSyntheticEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import loading from '@/assets/loading.gif';
import success from '@/assets/success.gif';
import { useEnrollUserMutation } from '@/redux/invite/inviteApiSlice';
import { useToast } from '@/components/ui/use-toast';

function base64toBlob(dataURI: string) {
  const splitDataURI = dataURI.split(',');
  const byteString =
    splitDataURI[0].indexOf('base64') >= 0
      ? atob(splitDataURI[1])
      : decodeURI(splitDataURI[1]);
  const mimeString = splitDataURI[0].split(':')[1].split(';')[0];

  const ia = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

const InviteLink = () => {
  const { inviteId } = useParams();
  const [userFace, setUserFace] = useState<string>('');
  const [markingAttendance, setMarkingAttendace] = useState<boolean>(false);
  const [attendanceMarked, setAttendanceMarked] = useState<boolean>(false);

  const { toast } = useToast();
  const [enrollUser, { isError }] = useEnrollUserMutation();
  const handleSubmitAsync = async (formData: FormData) => {
    const res = await enrollUser(formData);
    console.log(res);

    // const res = await enrollUser(formData);
    if (isError) {
      toast({
        title: 'Error',
        description: 'Failed to create the user',
      });
      return;
    }

    toast({
      title: 'Congratzz',
      description: `User created ${formData.get('email')}`,
    });
    setUserFace('');
    setAttendanceMarked(true);
  };
  if (inviteId === undefined) return;
  return (
    <div className='mx-auto max-w-screen-sm'>
      <Layout header={false}>
        <InviteForm
          previewMode={false}
          handleSubmit={(e: BaseSyntheticEvent) => {
            e.preventDefault();
            const formData = new FormData();
            for (let i = 0; i < e.target.length - 1; i++) {
              if (e.target[i].name !== undefined && e.target[i].name !== '')
                formData.append(e.target[i].name, e.target[i].value);
            }
            formData.append('inviteId', inviteId.toString());
            const file = base64toBlob(userFace);
            formData.append('file', file);
            setMarkingAttendace(true);
            handleSubmitAsync(formData)
              .then((e) => e)
              .catch((err) => alert(err));
            setMarkingAttendace(false);
          }}
          inviteId={inviteId}>
          {userFace == '' && (
            <FaceDetector
              attendanceMode={false}
              onFaceDetected={(image) => {
                setUserFace(image);
                const file = base64toBlob(image);
                console.log(file);
                // handleAttendance(image);
              }}
            />
          )}
          {userFace != '' && (
            <div className='flex gap-4 flex-col items-center w-100 pb-5'>
              <img src={userFace} alt='user face' className='rounded-md' />
              <Button
                variant='outline'
                className='w-full'
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();
                  setUserFace('');
                }}>
                Retake Photo
              </Button>
            </div>
          )}
        </InviteForm>
      </Layout>
      <Dialog open={markingAttendance}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Marking Attendance</DialogTitle>
            <DialogDescription>
              {attendanceMarked ? (
                <img src={success} alt='success' className='w-full h-auto' />
              ) : (
                <img src={loading} alt='loading' className='w-full h-auto' />
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InviteLink;
