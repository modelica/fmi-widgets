import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupportMatrixViewer } from './components';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

let elementMap = {
  'support': <SupportMatrixViewer />,
};

Object.keys(elementMap).forEach((name) => {
  let elem = document.getElementById(name) as HTMLElement;
  if (elem) {
    ReactDOM.render(elementMap[name], elem);
  }
});

registerServiceWorker();
