import reducer, {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  userActions
} from './user';

describe('Срез пользователя', () => {
  const initialState = {
    user: null,
    isLoading: false,
    error: null,
    isAuth: false,
    isUserChecked: false
  };

  const mockUser = {
    email: 'test@example.com',
    name: 'Test User'
  };

  const errorMessage = 'Ошибка авторизации';
  const request = 'request-1';

  describe('registerUser', () => {
    it('pending устанавливает флаг загрузки и очищает ошибку', () => {
      const action = registerUser.pending(request, {
        email: '',
        password: '',
        name: ''
      });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя, устанавливает isAuth в true', () => {
      const action = registerUser.fulfilled(mockUser, request, {
        email: '',
        password: '',
        name: ''
      });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку и сбрасывает флаг загрузки', () => {
      const action = registerUser.rejected(
        null,
        request,
        { email: '', password: '', name: '' },
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuth).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('loginUser', () => {
    it('pending устанавливает флаг загрузки', () => {
      const action = loginUser.pending(request, { email: '', password: '' });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя и авторизует', () => {
      const action = loginUser.fulfilled(mockUser, request, {
        email: '',
        password: ''
      });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку', () => {
      const action = loginUser.rejected(
        null,
        request,
        { email: '', password: '' },
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuth).toBe(false);
    });
  });

  describe('fetchUser', () => {
    it('pending устанавливает флаг загрузки', () => {
      const action = fetchUser.pending(request);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет данные пользователя и подтверждает авторизацию', () => {
      const action = fetchUser.fulfilled(mockUser, request);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected сбрасывает авторизацию и сохраняет ошибку', () => {
      const action = fetchUser.rejected(null, request, undefined, errorMessage);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuth).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('pending устанавливает флаг загрузки', () => {
      const action = updateUser.pending(request, { name: 'New Name' });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled обновляет данные пользователя', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = updateUser.fulfilled(updatedUser, request, {
        name: 'Updated Name'
      });

      const state = reducer({ ...initialState, user: mockUser }, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку', () => {
      const action = updateUser.rejected(
        null,
        request,
        { name: '' },
        errorMessage
      );
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('logoutUser', () => {
    it('pending устанавливает флаг загрузки', () => {
      const action = logoutUser.pending(request);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled полностью очищает данные пользователя и авторизацию', () => {
      const action = logoutUser.fulfilled(null, request);
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const state = reducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку, но не сбрасывает авторизацию', () => {
      const action = logoutUser.rejected(
        null,
        request,
        undefined,
        errorMessage
      );
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const state = reducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBe(mockUser);
      expect(state.isAuth).toBe(true);
    });
  });

  describe('обычные действия (reducers)', () => {
    it('clearError полностью очищает поле ошибки', () => {
      const stateWithError = { ...initialState, error: 'Какая-то ошибка' };
      const state = reducer(stateWithError, userActions.clearError());

      expect(state.error).toBeNull();
    });

    it('setUserChecked отмечает, что проверка пользователя завершена', () => {
      const state = reducer(initialState, userActions.setUserChecked());

      expect(state.isUserChecked).toBe(true);
    });
  });
});
