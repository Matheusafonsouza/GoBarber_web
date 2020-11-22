import { renderHook, act } from "@testing-library/react-hooks";
import { AuthProvider, useAuth } from "../../hooks/auth";
import MockAdapter from 'axios-mock-adapter';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'matheus afonso',
        email: 'matheusafonso@email.com',
      },
      token: 'token-example'
    }

    apiMock.onPost('sessions').reply(200, apiResponse);

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    result.current.signIn({
      email: 'matheusafonso@email.com',
      password: '123123123',
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:token', apiResponse.token);
    expect(setItemSpy).toHaveBeenCalledWith('@GoBarber:user', JSON.stringify(apiResponse.user));
    expect(result.current.user.email).toEqual('matheusafonso@email.com');
  });

  it('should restore saved data from storage when auth inits', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-example';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'matheus afonso',
            email: 'matheusafonso@email.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    expect(result.current.user.email).toEqual('matheusafonso@email.com');
  });

  it('should be able to sign out', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => {
      switch (key) {
        case '@GoBarber:token':
          return 'token-example';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'user123',
            name: 'matheus afonso',
            email: 'matheusafonso@email.com',
          });
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    act(() => {
      result.current.signOut();
    })

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider
    });

    const user = {
      id: 'user123',
      name: 'matheus afonso',
      email: 'matheusafonso@email.com',
      avatar_url: 'image-test.jpg'
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );

    expect(result.current.user).toEqual(user);
  });
});
