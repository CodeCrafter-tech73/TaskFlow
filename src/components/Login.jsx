import { useState } from 'react';
import { createAccount, signIn } from '../services/authStorage.js';

const EMPTY_ACCOUNT = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
};

function Login() {
  const [mode, setMode] = useState('signin');
  const [account, setAccount] = useState(EMPTY_ACCOUNT);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateAccount(event) {
    setAccount({ ...account, [event.target.name]: event.target.value });
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setMessage('');
    setError('');
  }

  async function handleSignIn(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      if (await signIn(username, password)) {
        window.location.assign('/');
      } else {
        setError('The username or password is incorrect.');
      }
    } catch {
      setError('Sign in could not be completed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateAccount(event) {
    event.preventDefault();
    setError('');
    setMessage('');

    if (!/^[a-zA-Z0-9_-]{3,24}$/.test(account.username.trim())) {
      setError('Choose a username with 3 to 24 letters, numbers, underscores, or hyphens.');
      return;
    }

    if (account.password.length < 8) {
      setError('Use a password with at least 8 characters.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createAccount(account);
      setUsername(account.username);
      setPassword('');
      setAccount(EMPTY_ACCOUNT);
      setMode('signin');
      setMessage('Account created. Sign in to continue.');
    } catch (signupError) {
      setError(signupError.message || 'Account could not be created. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const isSignup = mode === 'signup';

  return (
    <main className="auth-layout">
      <aside className="auth-aside">
        <a className="brand" href="/login.html" aria-label="TaskFlow home">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>TaskFlow</span>
        </a>
        <div className="aside-copy">
          <p className="eyebrow">Make room for what matters</p>
          <h1>Your day,<br />in good order.</h1>
          <p>Keep the next step clear, and the rest will follow.</p>
        </div>
        <span className="aside-index" aria-hidden="true">01 / ORGANIZE</span>
      </aside>

      <section className="auth-main" aria-labelledby="form-title">
        <div className="auth-form-wrap">
          <p className="form-kicker">TASKFLOW ACCOUNT</p>
          <h2 id="form-title">{isSignup ? 'Create your account' : 'Welcome back'}</h2>
          <p className="form-description">
            {isSignup ? 'A few details and you’re ready to begin.' : 'Sign in to pick up where you left off.'}
          </p>

          {isSignup ? (
            <form className="auth-form" onSubmit={handleCreateAccount}>
              <div className="field-grid">
                <div className="auth-field">
                  <label htmlFor="firstName">First name</label>
                  <input id="firstName" name="firstName" autoComplete="given-name" value={account.firstName} onChange={updateAccount} required />
                </div>
                <div className="auth-field">
                  <label htmlFor="lastName">Last name</label>
                  <input id="lastName" name="lastName" autoComplete="family-name" value={account.lastName} onChange={updateAccount} required />
                </div>
                <div className="auth-field field-wide">
                  <label htmlFor="email">Email</label>
                  <input id="email" name="email" type="email" autoComplete="email" value={account.email} onChange={updateAccount} required />
                </div>
                <div className="auth-field field-wide">
                  <label htmlFor="phone">Phone number</label>
                  <input id="phone" name="phone" type="tel" autoComplete="tel" value={account.phone} onChange={updateAccount} required />
                </div>
                <div className="auth-field field-wide">
                  <label htmlFor="newUsername">Username</label>
                  <input id="newUsername" name="username" autoComplete="username" value={account.username} onChange={updateAccount} minLength="3" maxLength="24" required />
                </div>
                <div className="auth-field field-wide">
                  <label htmlFor="newPassword">Password</label>
                  <input id="newPassword" name="password" type="password" autoComplete="new-password" value={account.password} onChange={updateAccount} minLength="8" required />
                </div>
              </div>
              {error && <p className="form-message error-message" role="alert">{error}</p>}
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Create account'}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleSignIn}>
              <div className="auth-field">
                <label htmlFor="username">Username</label>
                <input id="username" name="username" autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
              </div>
              <div className="auth-field">
                <label htmlFor="password">Password</label>
                <input id="password" name="password" type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              {message && <p className="form-message success-message" role="status">{message}</p>}
              {error && <p className="form-message error-message" role="alert">{error}</p>}
              <button className="primary-button" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Signing in…' : 'Sign in'}
              </button>
            </form>
          )}

          <p className="mode-switch">
            {isSignup ? 'Already have an account?' : 'New to TaskFlow?'}{' '}
            <button type="button" onClick={() => changeMode(isSignup ? 'signin' : 'signup')}>
              {isSignup ? 'Sign in' : 'Create new account'}
            </button>
          </p>
        </div>
        <footer className="auth-footer">TaskFlow <span>·</span> Keep your focus moving.</footer>
      </section>
    </main>
  );
}

export default Login;