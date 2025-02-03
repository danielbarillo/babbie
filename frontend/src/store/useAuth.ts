const login = async (username: string, password: string) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();

    // Log token for debugging
    console.log('Received token:', data.token);

    // Store token
    localStorage.setItem('token', data.token);

    // Update state
    set({
      user: data.user,
      token: data.token,
      isAuthenticated: true,
      error: null
    });

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const checkAuth = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    const response = await fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }

    const user = await response.json();
    set({ user, isAuthenticated: true });
  } catch (error) {
    console.error('Check auth error:', error);
    set({ user: null, isAuthenticated: false });
  }
};