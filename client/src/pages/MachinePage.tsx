import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Session,
  useGetSessionsForMachineQuery,
} from '@/redux/machine/machineApiSlice';
import { Skeleton } from '@/components/ui/skeleton';
import { Tv } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSession } from '@/redux/machine/machineSlice';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

import React from 'react';

const MachinePage = () => {
  const { data } = useGetSessionsForMachineQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <>
      <h1>Upcoming Sessions</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Session id</TableHead>
            <TableHead>Session Name</TableHead>
            <TableHead>Start time</TableHead>
            <TableHead>End time</TableHead>
            <TableHead className='w-[100px]'>Select</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data === undefined
            ? [1, 1, 1, 1, 1].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className='font-medium'>
                    <Skeleton className='h-[30px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-[30px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-[30px]' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-[30px]' />
                  </TableCell>
                  <TableCell className='w-[100px]'>
                    <Skeleton className='h-[30px]' />
                  </TableCell>
                </TableRow>
              ))
            : data.map((d: Session) => (
                <TableRow key={d.id}>
                  <TableCell className='font-medium'>{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>{d.startDateTime.toLocaleString()}</TableCell>
                  <TableCell>{d.endDateTime.toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      onClick={(_: React.MouseEvent<HTMLElement>) => {
                        dispatch(
                          setSession({
                            id: d.id,
                            name: d.name,
                            startDateTime: String(d.startDateTime),
                            endDateTime: String(d.endDateTime),
                          })
                        );
                        navigate(`/machine/mark/${d.id}`);
                      }}>
                      <Tv />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </>
  );
};

export default MachinePage;
