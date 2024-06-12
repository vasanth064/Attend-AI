import { Checkbox } from '@/components/ui/checkbox';
import {
  FormConfig,
  InviteLink,
  useApproveUserSignupsMutation,
  useGetAllSignupsQuery,
  useGetInviteQuery,
} from './inviteApiSlice';
import { User } from '../authentication/authSlice';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import TableView from '@/components/TableView';
import { useToast } from '@/components/ui/use-toast';

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
          Name
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => <div className='lowercase'>{row.getValue('name')}</div>,
  },
  {
    id: 'email',
    accessorKey: 'email',
    header: () => <Button variant='ghost'>Email</Button>,
    cell: ({ row }) => <div className='lowercase'>{row.getValue('email')}</div>,
  },
  {
    id: 'Action',
    header: () => <Button variant='ghost'>Action</Button>,
    cell: ({ row }) => {
      const [approveUsers, { isLoading }] = useApproveUserSignupsMutation();
      const toaster = useToast();
      return (
        <Button
          variant='default'
          disabled={isLoading}
          onClick={() => {
            approveUsers([row.original.id]);
            toaster.toast({
              title: 'Approved',
              description: `${row.original.name} has been approved`,
            });
          }}>
          Approve
        </Button>
      );
    },
  },
];

interface InviteSignupListProps {
  mode: 'manage' | 'view';
  inviteId: number;
}

const getColumnsFromData = (
  data: InviteLink,
  mode: 'manage' | 'view'
): ColumnDef<User>[] => {
  const dataColumns = [...columns];
  const actionCol = dataColumns.pop();
  const formStructure = data.config as FormConfig[];
  formStructure.map((formField) => {
    console.log(formField.label);
    dataColumns.push({
      id: formField.label,
      accessorKey: `userData.${formField.label}`,
      header: () => <Button variant='ghost'>{formField.label}</Button>,
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue(formField.label)}</div>
      ),
    });
  });
  if (mode == 'manage' && actionCol) {
    dataColumns.push(actionCol);
  }
  return dataColumns;
};

const InviteSignupList = ({ mode, inviteId }: InviteSignupListProps) => {
  if (!inviteId) return <div>No invite id</div>;

  const { data, isLoading } = useGetAllSignupsQuery({
    inviteId,
    status: mode == 'view' ? 'ENABLED' : 'DISABLED',
  });
  const { data: inviteLinkData, isLoading: inviteLinkLoading } =
    useGetInviteQuery(String(inviteId));

  if (isLoading || inviteLinkLoading) return <div>Loading...</div>;
  if (!inviteLinkData) return <div>No data</div>;
  console.log(data);
  return (
    <TableView
      columns={getColumnsFromData(inviteLinkData, mode)}
      data={data ?? []}
      search={{ columnName: 'name', label: 'Name' }}
    />
  );
};

export default InviteSignupList;
