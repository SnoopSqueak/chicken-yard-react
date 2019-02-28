import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// I've done TDD with Node before, but only with Jasmine and .spec files. I
//   don't know much about this format. It looks similar, but without
//   the `expects` calls.
it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
