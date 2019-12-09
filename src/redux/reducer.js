import multireducer from 'multireducer';
import auth from './modules/auth';
import notifs from './modules/notifs';
import counter from './modules/counter';
import info from './modules/info';
import todos from './modules/todos';
import todos2 from './modules/todos2';

export default function createReducers(asyncReducers) {
  return {
    online: (v = true) => v,
    notifs,
    auth,
    counter: multireducer({
      counter1: counter,
      counter2: counter,
      counter3: counter
    }),
    info,
    todos,
    todos2,
    ...asyncReducers
  };
}
