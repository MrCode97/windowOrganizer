import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './AuthProvider';
import App from './App';

test('renders the app without crashing', () => {
  const { container } = render(
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  );
  expect(container.querySelector('.mainBox')).toBeInTheDocument();
});