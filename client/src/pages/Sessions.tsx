import { useGetSessionsQuery } from '@/redux/sessions/sessionsApiSlice';

const Sessions = () => {
  const { data, isLoading } = useGetSessionsQuery();
  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>Sessions</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
};

export default Sessions;
