import FaceDetector from '@/components/FaceDetector';
import InviteForm from './InviteForm';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { BaseSyntheticEvent, useState } from 'react';
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
  const handleAttendance = async (image: string) => {
    setMarkingAttendace(true);
    setTimeout(() => {
      setAttendanceMarked(true);
      setTimeout(() => {
        setMarkingAttendace(false);
        setUserFace('');
      }, 1800);
    }, 2000);
  };
  return (
    <div className='mx-auto max-w-screen-sm'>
      <Layout header={false}>
        <InviteForm
          previewMode={false}
          handleSubmit={(e: BaseSyntheticEvent) => {
            e.preventDefault();
            const body: Record<string, unknown> = {};
            for (let i = 0; i < e.target.length - 1; i++) {
              body[e.target[i].name] = e.target[i].value;
            }
            const file = base64toBlob(userFace);
            console.log(body, file);
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
              <Button variant='outline' className='w-full'>
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
