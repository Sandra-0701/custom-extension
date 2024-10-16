import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as SDK from 'azure-devops-extension-sdk';

SDK.init();

SDK.ready().then(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
});
