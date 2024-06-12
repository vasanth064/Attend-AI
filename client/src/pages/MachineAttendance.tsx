import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentMachineSession } from "@/redux/machine/machineSlice";
import { useState } from "react";
import FaceDetector from "@/components/FaceDetector";
import { useMarkAttendanceMutation } from "@/redux/machine/machineApiSlice";


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

  const [markAttendance, obj] = useMarkAttendanceMutation();
  const handleAttendance = async (image: string) => {
    const file = base64toBlob(image);
    setMarkingAttendace(true);
    // const res = await markAttendance({ sessionID: id, file: file });
    setTimeout(() => {
      setAttendanceMarked(true);
      setTimeout(() => {
        setMarkingAttendace(false);
        setUserFace('');
      }, 1800);
    }, 2000);
  };
  return (
    <>
      <div>Session {id}</div>
      <div>{name} {startDateTime} {endDateTime}</div>
      {userFace == '' && (
        <FaceDetector
          attendanceMode={true}
          onFaceDetected={(image) => {
            setUserFace(image);
            const file = base64toBlob(image);
            console.log(file);
            handleAttendance(image);
          }}
        />
      )}
    </>
  )

}

export default MachineAttendance;
