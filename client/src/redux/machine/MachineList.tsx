import { ColumnDef } from '@tanstack/react-table';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useGetMachinesQuery,
  useDeleteMachineMutation,
} from './machineApiSlice';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import TableView from '@/components/TableView';
import { User } from '../authentication/authSlice';

const columns: ColumnDef<User>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Machine Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: () => <div className='text-right'>Email</div>,
    cell: ({ row }) => {
      const email = row.getValue('email') as string;

      return <div className='text-right font-medium'>{email}</div>;
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-right'>Status</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <div className='text-right font-medium'>{status}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const [deleteMachine, { isLoading }] = useDeleteMachineMutation();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open Menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    disabled={isLoading}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}>
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <ConfirmationDialog
                  title='Delete Session'
                  description='Are you sure?'
                  onConfirm={async () => {
                    await deleteMachine(String(row.original.id));
                  }}
                  onCancel={() => {}}
                />
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
const MachinesList = () => {
  const { data, isLoading } = useGetMachinesQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <TableView
      data={data ?? []}
      columns={columns}
      search={{ columnName: 'name', label: 'Machines' }}
    />
  );
};

export default MachinesList;
