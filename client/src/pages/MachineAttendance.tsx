import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentMachineSession } from "@/redux/machine/machineSlice";
import { useState } from "react";
import FaceDetector from "@/components/FaceDetector";
import { useMarkAttendanceMutation } from "@/redux/machine/machineApiSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import loading from '@/assets/loading.gif';
import success from '@/assets/success.gif';
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useToast } from "@/components/ui/use-toast";
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

const MachineAttendance = () => {
  const { id } = useParams();
  if (id === undefined)
    return;

  const { name, startDateTime, endDateTime } = useSelector(selectCurrentMachineSession);
  const [userFace, setUserFace] = useState<string>('');
  const [markingAttendance, setMarkingAttendace] = useState<boolean>(false);
  const [attendanceMarked, setAttendanceMarked] = useState<boolean>(false);

  const { toast } = useToast();
  const [markAttendance, obj] = useMarkAttendanceMutation();
  const handleAttendance = async (image: string) => {
    const file = base64toBlob(image);
    setMarkingAttendace(true);
    const res = await markAttendance({ sessionID: id, file: file });
    setAttendanceMarked(true);
    setMarkingAttendace(false);
    setAttendanceMarked(false);
    setUserFace('');
    if (res.error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: (res.error as any).data.message,
      })
      return;
    }
    alert(res.data.message);
  };
  return (
    <>
      <div>Session Name: {name}</div>
      {userFace == '' && (
        <FaceDetector
          attendanceMode={true}
          onFaceDetected={(image) => {
            console.log("asdf");
            setUserFace(image);
            const file = base64toBlob(image);
            console.log(file);
            handleAttendance(image);
          }}
        />
      )}
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
    </>
  )

}

export default MachineAttendance;
