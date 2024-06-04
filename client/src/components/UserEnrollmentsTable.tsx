import { useGetUserSessionsQuery } from "@/redux/users/userApiSlice";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { Skeleton } from "./ui/skeleton";

const UserEnrollmentsTable = () => {
  const { data, isLoading } = useGetUserSessionsQuery();
  return (
    <>
      <h1 className="text-3xl">Enrolled Sessions</h1>
      {isLoading ? <div>Loading..</div> :
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Id</TableHead>
              <TableHead>Session Name</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead >End Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>

            {data === undefined ?
              [1, 1, 1, 1, 1].map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium"><Skeleton className="h-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-[150px]" /></TableCell>
                  <TableCell><Skeleton className="h-[150px]" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-[150px]" /></TableCell>
                </TableRow>
              ))
              : data.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-medium">{d.id}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell>
                    {(new Date(d.startDateTime)).toLocaleDateString() +
                      " " +
                      (new Date(d.startDateTime)).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    {(new Date(d.endDateTime)).toLocaleDateString() +
                      " " +
                      (new Date(d.endDateTime)).toLocaleTimeString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      }
    </>
  )
}

export default UserEnrollmentsTable
