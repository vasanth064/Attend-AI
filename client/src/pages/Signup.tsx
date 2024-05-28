import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useSignupMutation } from '@/redux/authentication/authApiSlice';
import { setCredentials } from '@/redux/authentication/authSlice';
import { Label } from '@radix-ui/react-label';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [signup, { isLoading }] = useSignupMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userData = await signup({ email, password, name }).unwrap();
      dispatch(setCredentials(userData));
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Card className='mx-auto max-w-sm'>
      <CardHeader>
        <CardTitle className='text-xl'>Sign Up</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4'>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='first-name'>Name</Label>
                <Input
                  id='first-name'
                  placeholder='Max'
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                type='email'
                placeholder='m@example.com'
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              Create an account
            </Button>
          </div>
          <div className='mt-4 text-center text-sm'>
            Already have an account?{' '}
            <Link to='/signin' className='underline'>
              Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default Signup;
