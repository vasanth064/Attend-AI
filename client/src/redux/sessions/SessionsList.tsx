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
  Session,
  useDeleteSessionMutation,
  useGetSessionsQuery,
} from './sessionsApiSlice';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import TableView from '@/components/TableView';

const columns: ColumnDef<Session>[] = [
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
          Session Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'startDateTime',
    header: () => <div className='text-right'>Session Start Date</div>,
    cell: ({ row }) => {
      const sessionStartDate = row.getValue('startDateTime') as string;

      return <div className='text-right font-medium'>{sessionStartDate}</div>;
    },
  },
  {
    accessorKey: 'endDateTime',
    header: () => <div className='text-right'>Session End Date</div>,
    cell: ({ row }) => {
      const sessionStartDate = row.getValue('endDateTime') as string;
      return <div className='text-right font-medium'>{sessionStartDate}</div>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const [deleteSession, { isLoading }] = useDeleteSessionMutation();

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
                    await deleteSession(row.original.id);
                  }}
                  onCancel={() => {}}
                />
              </AlertDialog>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    disabled={isLoading}
                    onSelect={(e) => {
                      e.preventDefault();
                    }}>
                    Update
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <ConfirmationDialog
                  title='Update Session'
                  description='Are you sure?'
                  onConfirm={async () => {
                    await deleteSession(row.original.id);
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

const SessionsList = () => {
  const { data, isLoading } = useGetSessionsQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <TableView
      data={data ?? []}
      columns={columns}
      search={{ columnName: 'name', label: 'Sessions' }}
    />
  );
};

export default SessionsList;
