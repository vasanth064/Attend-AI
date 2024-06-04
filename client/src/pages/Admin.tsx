import { useState } from 'react'

import CreateClientForm from '@/components/forms/CreateClientForm';
import { Button } from '@/components/ui/button';
import ClientViewTable from '@/components/ClientViewTable';

export default function Admin() {

  const [nav, setNav] = useState('view');
  // const user = useSelector(selectCurrentUser);

  return (
    <div>
      <nav className='flex gap-2'>
        <Button onClick={() => setNav('create')}>Create Client</Button>
        <Button onClick={() => setNav('view')}>View Clients</Button>
      </nav>
      {nav === 'create' ?
        <CreateClientForm /> :
        <>
          <h1>Client Details</h1>
          <ClientViewTable />
        </>
      }
    </div>
  )
}

