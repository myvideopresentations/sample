import React from 'react';
import Loadable from 'react-loadable';

const TodosLoadable = Loadable({
  loader: () => import('./Todos2' /* webpackChunkName: 'about' */).then(module => module.default),
  loading: () => <div>Loading</div>
});

export default TodosLoadable;
