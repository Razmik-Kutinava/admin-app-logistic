import { createSignal } from 'solid-js';
import type { JSX } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { signIn } from '../stores/authStore';
import { Card, Input, Button } from '../components/UI';
import styles from './LoginPage.module.css';

function LoginPage(): JSX.Element {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal('');
  const [password, setPassword] = createSignal('');
  const [loading, setLoading] = createSignal(false);
  const [error, setError] = createSignal('');

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email(), password());

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Ошибка входа');
    }

    setLoading(false);
  };

  return (
    <div class={styles.container}>
      <Card class={styles.card} shadow="medium">
        <div class={styles.header}>
          <h1>Логистическая панель</h1>
          <p>Вход в систему</p>
        </div>

        <form onSubmit={handleSubmit} class={styles.form}>
          <Input
            type="email"
            label="Email"
            value={email()}
            onInput={(e) => setEmail(e.currentTarget.value)}
            placeholder="admin@logistic.am"
            required
            fullWidth
          />

          <Input
            type="password"
            label="Пароль"
            value={password()}
            onInput={(e) => setPassword(e.currentTarget.value)}
            placeholder="Введите пароль"
            required
            fullWidth
          />

          {error() && (
            <div class={styles.error}>
              {error()}
            </div>
          )}

          <Button
            type="submit"
            fullWidth
            loading={loading()}
            disabled={!email() || !password()}
          >
            Войти
          </Button>
        </form>

        <div class={styles.info}>
          <p>Тестовый аккаунт:</p>
          <p><strong>admin@logistic.am</strong></p>
          <p>Создайте пользователя в Supabase Auth</p>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;

