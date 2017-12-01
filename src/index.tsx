import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { SupportMatrixViewer } from './components';
import { loadData } from './components/data';
import './index.css';

let query = loadData();
let elementMap = {
  'support': <SupportMatrixViewer query={query} />,
};

Object.keys(elementMap).forEach((name) => {
  let elem = document.getElementById(name) as HTMLElement;
  if (elem) {
    ReactDOM.render(elementMap[name], elem);
  }
});
