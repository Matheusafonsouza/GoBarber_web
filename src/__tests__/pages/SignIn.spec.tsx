import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SignIn from '../../pages/SignIn';

const mockedHistoryPush = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  }
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: jest.fn(),
    })
  }
})

describe('SignIn Page', () => {
  it('should be able to sign in', async () => {

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');

    fireEvent.change(emailField, { target: { value: 'matheusafonso@gmail.com' } });
    fireEvent.change(passwordField, { target: { value: '123123123' } });

    const buttonElement = getByText('Entrar');

    fireEvent.click(buttonElement);

    await waitFor(() => expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard'));
  })
})
