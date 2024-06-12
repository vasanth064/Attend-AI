import InviteSignupList from '@/redux/invite/InviteSignupList';
import { useGetInviteQuery } from '@/redux/invite/inviteApiSlice';
import { useParams } from 'react-router-dom';

interface ManageInviteLinkSignupProps {
  mode: 'manage' | 'view';
}

const ManageInviteLinkSignup = ({ mode }: ManageInviteLinkSignupProps) => {
  const params = useParams();
  if (!params.inviteId) return <div>404 </div>;
  const inviteId = parseInt(params.inviteId);
  const { data, isLoading } = useGetInviteQuery(String(inviteId));
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1 className='text-2xl font-bold'>
        {mode == 'view'
          ? `${data?.name} Sign Up's`
          : `Manage ${data?.name} Sign Up's`}
      </h1>
      <InviteSignupList mode={mode} inviteId={inviteId} />
    </div>
  );
};

export default ManageInviteLinkSignup;
