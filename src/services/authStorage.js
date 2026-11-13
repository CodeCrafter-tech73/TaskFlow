const ACCOUNTS_KEY = 'taskflow-accounts';
const SESSION_KEY = 'taskflow-session';
const PASSWORD_ITERATIONS = 210000;

function readAccounts() {
  try {
    const accounts = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]');
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
}

function normalizeUsername(username) {
  return username.trim().toLowerCase();
}

function toBase64(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)));
}

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  );
  const result = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations: PASSWORD_ITERATIONS },
    key,
    256
  );

  return toBase64(result);
}

export async function createAccount(accountDetails) {
  const accounts = readAccounts();
  const username = normalizeUsername(accountDetails.username);

  if (accounts.some((account) => account.username === username)) {
    throw new Error('That username is already taken.');
  }

  const salt = crypto.getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(accountDetails.password, salt);
  accounts.push({
    firstName: accountDetails.firstName.trim(),
    lastName: accountDetails.lastName.trim(),
    email: accountDetails.email.trim().toLowerCase(),
    phone: accountDetails.phone.trim(),
    username,
    salt: toBase64(salt),
    passwordHash,
  });
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export async function signIn(usernameInput, password) {
  const username = normalizeUsername(usernameInput);
  const account = readAccounts().find((item) => item.username === username);

  if (!account) {
    return false;
  }

  const salt = Uint8Array.from(atob(account.salt), (character) => character.charCodeAt(0));
  const passwordHash = await hashPassword(password, salt);

  if (passwordHash !== account.passwordHash) {
    return false;
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify({ username }));
  return true;
}

export function isSignedIn() {
  try {
    const session = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return Boolean(session?.username && readAccounts().some((account) => account.username === session.username));
  } catch {
    return false;
  }
}

export function signOut() {
  localStorage.removeItem(SESSION_KEY);
}