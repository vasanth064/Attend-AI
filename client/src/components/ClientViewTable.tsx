import { useDeleteClientMutation, useGetAllClientsQuery } from "@/redux/admin/adminApiSlice";
import { Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Skeleton } from "./ui/skeleton";
import { useToast } from "./ui/use-toast";
import { SerializedError } from "@reduxjs/toolkit";


interface TableData {
  id: number;
  name: string;
}

const ClientViewTable = () => {
  const { data } = useGetAllClientsQuery();
  const [deleteClient, obj] = useDeleteClientMutation();
  const { toast } = useToast();

  async function handleDelete(id: number) {
    const res = await deleteClient({ id }).unwrap();
    if (obj.error) {
      const error = obj.error as SerializedError;
      toast({
        title: "Message",
        description: error.message
      })
      return;
    }

    toast({
      title: "Success",
      description: res.message
    })

  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Client ID</TableHead>
          <TableHead>Client Name</TableHead>
          <TableHead className="w-[100px]">Delete</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data === undefined ?
          [1, 1, 1, 1, 1].map((_, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium"><Skeleton className="h-[30px]" /></TableCell>
              <TableCell><Skeleton className="h-[30px]" /></TableCell>
              <TableCell><Skeleton className="h-[30px]" /></TableCell>
            </TableRow>
          ))
          : data.map((d: TableData) => (
            <TableRow key={d.id}>
              <TableCell className="font-medium">{d.id}</TableCell>
              <TableCell>{d.name}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button><Trash2 /></button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this client and its associated users.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(d.id)} className="bg-red-500">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  )
}

export default ClientViewTable;
