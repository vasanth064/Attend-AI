import { useParams } from 'react-router-dom';
import { ReportResponseObject } from '@/redux/users/userApiSlice';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useSessionReportQuery } from '@/redux/sessions/sessionsApiSlice';

const customDateFormat = (date: Date) => {
  return (
    new Date(date).toLocaleDateString() +
    ' ' +
    new Date(date).toLocaleTimeString()
  );
};

const getAttendanceStatus = (data: ReportResponseObject) => {
  if (data.AttendanceLogs.length === 0) {
    if (data.session.endDateTime < new Date())
      return <Badge className='bg-red-500'>Absent</Badge>;
    else return <Badge className='bg-slate-500'>Upcoming</Badge>;
  }
  return <Badge className='bg-green-500'>Present</Badge>;
};

const UserReportTable = ({
  data,
  isLoading,
}: {
  data: ReportResponseObject[];
  isLoading: boolean;
}) => {
  return (
    <>
      {data.length === 0 ? (
        <div className='w-full h-full bg-slate-100 rounded-md grid place-items-center text-muted-foreground'>
          Currently, there are no logs. Try applying any filters
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Attendance Marked At</TableHead>
              <TableHead className='text-right'>Attendance Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((d, index) => (
              <TableRow key={index}>
                <TableCell className='font-medium'>
                  {isLoading ? (
                    <Skeleton className='h-[30px]' />
                  ) : (
                    d.session.name
                  )}
                </TableCell>
                <TableCell>
                  {isLoading ? (
                    <Skeleton className='h-[30px]' />
                  ) : (
                    customDateFormat(d.session.startDateTime)
                  )}
                </TableCell>
                <TableCell>
                  {isLoading ? (
                    <Skeleton className='h-[30px]' />
                  ) : (
                    customDateFormat(d.session.endDateTime)
                  )}
                </TableCell>
                <TableCell className='text-right'>
                  {isLoading ? (
                    <Skeleton className='h-[30px]' />
                  ) : (
                    getAttendanceStatus(d)
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

const SessionView = () => {
  const { id } = useParams();
  if (id === undefined) return;
  const { data } = useSessionReportQuery(parseInt(id));

  return (
    <>
      <div>Session {id}</div>
      <section className='flex gap-10 w-full h-full'>
        {data !== undefined && (
          <aside className='flex flex-col gap-4 w-full min-h-[500px]'>
            <h2>{data.length !== 0 ? 'Report' : ''}</h2>
            <UserReportTable data={data} isLoading={false} />
          </aside>
        )}
      </section>
    </>
  );
};

export default SessionView;
