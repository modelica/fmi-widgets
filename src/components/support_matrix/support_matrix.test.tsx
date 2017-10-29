import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupportMatrixViewer } from './support_matrix';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SupportMatrixViewer />, div);
});
