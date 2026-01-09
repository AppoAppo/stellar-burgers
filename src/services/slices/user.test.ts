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

  describe('registerUser', () => {
    it('pending устанавливает флаг загрузки и очищает ошибку', () => {
      const action = registerUser.pending('req1', {
        email: '',
        password: '',
        name: ''
      });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя, устанавливает isAuth в true', () => {
      const action = registerUser.fulfilled(mockUser, 'req1', {
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
        'req1',
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
      const action = loginUser.pending('req2', { email: '', password: '' });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя и авторизует', () => {
      const action = loginUser.fulfilled(mockUser, 'req2', {
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
        'req2',
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
      const action = fetchUser.pending('req3');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет данные пользователя и подтверждает авторизацию', () => {
      const action = fetchUser.fulfilled(mockUser, 'req3');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.error).toBeNull();
    });

    it('rejected сбрасывает авторизацию и сохраняет ошибку', () => {
      const action = fetchUser.rejected(null, 'req3', undefined, errorMessage);
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.isAuth).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('pending устанавливает флаг загрузки', () => {
      const action = updateUser.pending('req4', { name: 'New Name' });
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled обновляет данные пользователя', () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = updateUser.fulfilled(updatedUser, 'req4', {
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
        'req4',
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
      const action = logoutUser.pending('req5');
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled полностью очищает данные пользователя и авторизацию', () => {
      const action = logoutUser.fulfilled(null, 'req5');
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

    it('rejected сохраняет ошибку, но сбрасывает авторизацию', () => {
      const action = logoutUser.rejected(null, 'req5', undefined, errorMessage);
      const stateWithUser = {
        ...initialState,
        user: mockUser,
        isAuth: true
      };

      const state = reducer(stateWithUser, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
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
