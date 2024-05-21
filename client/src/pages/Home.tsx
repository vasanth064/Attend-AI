import { Button } from '@/components/ui/button';
import { useSelector, useDispatch } from 'react-redux';
import { counterSlice } from '@/redux/counter/counterSlice';
import { RootState } from '@/redux/store';

const Home = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <center>
      <h1>Count : {count}</h1>
      <div className='d-flex gap-3'>
        <Button onClick={() => dispatch(counterSlice.actions.increment())}>
          Increment
        </Button>
        <Button onClick={() => dispatch(counterSlice.actions.decrement())}>
          Decrement
        </Button>
      </div>
    </center>
  );
};

export default Home;
