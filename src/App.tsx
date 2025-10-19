import { Show } from 'solid-js';
import type { JSX } from 'solid-js';
import { Router, Route } from '@solidjs/router';
import { authStore } from './stores/authStore';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DriverPage from './pages/DriverPage';
import './styles/global.css';

// Protected Route wrapper
function ProtectedRoute(props: { children: any }): JSX.Element {
  return (
    <Show
      when={!authStore.loading()}
      fallback={<div style={{ padding: '40px', 'text-align': 'center' }}>Загрузка...</div>}
    >
      <Show
        when={authStore.isAuthenticated()}
        fallback={<LoginPage />}
      >
        {props.children}
      </Show>
    </Show>
  );
}

function App(): JSX.Element {
  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <Route path="/" component={() => (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )} />
      <Route path="/dashboard" component={() => (
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      )} />
      <Route path="/driver/:id" component={() => (
        <ProtectedRoute>
          <DriverPage />
        </ProtectedRoute>
      )} />
    </Router>
  );
}

export default App;
