import TableView from '@/components/TableView';
import {
  InviteLink,
  useDeleteInviteMutation,
  useGetInvitesQuery,
} from './inviteApiSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  UserCheck2,
  Users2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { Link } from 'react-router-dom';

const columns: ColumnDef<InviteLink>[] = [
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
          Invite Link Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('name')}</div>,
  },
  {
    id: 'preview',
    header: () => <Button variant='ghost'>Preview</Button>,
    cell: ({ row }) => (
      <Link to={`${row.original.id}`} className='cursor-pointer'>
        <Button variant='ghost'>
          <Eye />
        </Button>
      </Link>
    ),
  },
  {
    id: 'manage',
    header: () => <Button variant='ghost'>Manage Sign Up's</Button>,
    cell: ({ row }) => (
      <>
        <Link to={`${row.original.id}/manage`} className='cursor-pointer'>
          <Button variant='ghost'>
            <UserCheck2 />
          </Button>
        </Link>
        <Link to={`${row.original.id}/view`} className='cursor-pointer'>
          <Button variant='ghost'>
            <Users2 />
          </Button>
        </Link>
      </>
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    header: () => <Button variant='ghost'>Actions</Button>,
    cell: ({ row }) => {
      const [deleteInviteLink, { isLoading }] = useDeleteInviteMutation();

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
                    await deleteInviteLink(row.original.id);
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

const InvitesList = () => {
  const { data, isLoading } = useGetInvitesQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <TableView
      data={data ?? []}
      columns={columns}
      search={{ columnName: 'name', label: 'Sessions' }}
    />
  );
};

export default InvitesList;
