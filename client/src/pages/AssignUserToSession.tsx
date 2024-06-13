import TableView from '@/components/TableView';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from '@/redux/authentication/authSlice';
import { FormConfig, useGetInvitesQuery } from '@/redux/invite/inviteApiSlice';
import {
  useEnrollUsersMutation,
  useGetSessionUsersQuery,
  useNotEnrolledUsersQuery,
  useUnEnrollUserMutation,
} from '@/redux/sessions/sessionsApiSlice';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
];
const userColumns: ColumnDef<User>[] = [
  ...columns,
  {
    id: 'Action',
    header: () => <Button variant='ghost'>Action</Button>,
    cell: ({ row }) => {
      const toaster = useToast();
      const [unenrollUser, { isLoading }] = useUnEnrollUserMutation();
      const { sessionId } = useParams();

      return (
        <Button
          variant='default'
          disabled={isLoading}
          onClick={async () => {
            if (!sessionId) return <p>Not Available</p>;
            await unenrollUser({
              userID: row.original.id,
              sessionID: sessionId,
            });
            console.log(row.original.id, sessionId);
            toaster.toast({
              title: 'Un Enrolled',
              description: `${row.original.name} has been Un Enrolled from the session`,
            });
          }}>
          Delete
        </Button>
      );
    },
  },
];

const getColumnsFromData = (
  data: string,
  mode: 'manage' | 'view'
): ColumnDef<User>[] => {
  const dataColumns = [...columns];
  const formStructure = JSON.parse(data) as FormConfig[];
  formStructure.map((formField) => {
    dataColumns.push({
      id: formField.label,
      accessorKey: `userData.${formField.label}`,
      header: () => <Button variant='ghost'>{formField.label}</Button>,
      cell: ({ row }) => (
        <div className='lowercase'>{row.getValue(formField.label)}</div>
      ),
    });
  });
  if (mode == 'manage') {
    dataColumns.push({
      id: 'Action',
      header: () => <Button variant='ghost'>Action</Button>,
      cell: ({ row }) => {
        const toaster = useToast();
        const [enrollUsers, { isLoading }] = useEnrollUsersMutation();
        const { sessionId } = useParams();

        return (
          <Button
            variant='default'
            disabled={isLoading}
            onClick={async () => {
              if (!sessionId) return <p>Not Available</p>;
              await enrollUsers({
                userID: row.original.id,
                sessionID: sessionId,
              });
              toaster.toast({
                title: 'Assigned',
                description: `${row.original.name} has been assigned to the session`,
              });
            }}>
            Assign
          </Button>
        );
      },
    });
  }
  return dataColumns;
};

const AssignUserToSession = () => {
  const { sessionId } = useParams();
  const { data: invitesData, isLoading: invitesIsLoading } =
    useGetInvitesQuery();

  if (!sessionId) return <div>Not Available</div>;

  const { data, isLoading } = useGetSessionUsersQuery(sessionId);

  if (invitesIsLoading || isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className='text-2xl'>Enroll Users To Session</h1>
      <Accordion type='single' collapsible>
        {invitesData?.map((invite) => (
          <AccordionItem value={`invite-${invite.id}`}>
            <AccordionTrigger>{invite.name}</AccordionTrigger>
            <AccordionContent>
              <InviteLinkUsers
                inviteId={String(invite.id) as string}
                inviteConfig={invite.config as string}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <br />
      <h1 className='text-2xl'>Enrolled Users</h1>
      <TableView
        data={data ?? []}
        columns={userColumns}
        search={{ columnName: 'name', label: 'name' }}
      />
    </div>
  );
};

export default AssignUserToSession;

function InviteLinkUsers({
  inviteId,
  inviteConfig,
}: {
  inviteId: string;
  inviteConfig: string;
}) {
  const { sessionId } = useParams();

  if (!sessionId) return <div>Not Available</div>;

  const { data, isLoading } = useNotEnrolledUsersQuery({
    sessionID: sessionId,
    inviteID: inviteId,
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <TableView
      data={data ?? []}
      columns={getColumnsFromData(inviteConfig, 'manage')}
      search={{ columnName: 'name', label: 'name' }}
    />
  );
}
