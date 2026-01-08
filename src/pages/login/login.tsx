import { FC, SyntheticEvent, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginUI } from '@ui-pages';
import { useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/user';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: string })?.from || '/';

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);
    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigate(from, { replace: true });
      })
      .catch((err: any) =>
        setError(typeof err === 'string' ? err : err?.message || String(err))
      );
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
