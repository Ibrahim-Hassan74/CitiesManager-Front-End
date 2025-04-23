function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  const page = hash ? `${hash}.html` : 'index.html';
  loadPage(page);
  updateNav();
});

window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1);
  const page = hash ? `${hash}.html` : 'index.html';
  loadPage(page);
});

async function updateNav() {
  const token = localStorage['token'];
  const refreshToken = localStorage['refreshToken'];
  if (token === '' || refreshToken === '') return;

  const isTokenValid = () => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (err) {
      return false;
    }
  };

  let isLoggedIn = isTokenValid();

  if (!isLoggedIn && refreshToken) {
    // console.log(isLoggedIn);
    try {
      const response = await axios.post(
        'https://localhost:7115/api/v1/account/generate-new-jwt-token',
        {
          token: token,
          refreshToken: refreshToken,
        }
      );

      localStorage['token'] = response.data.token;
      localStorage['refreshToken'] = response.data.refreshToken;
      isLoggedIn = true;
    } catch (err) {
      console.warn('Refresh token invalid or expired');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }

  document.getElementById('loginNav').style.display = isLoggedIn
    ? 'none'
    : 'inline-block';
  document.getElementById('registerNav').style.display = isLoggedIn
    ? 'none'
    : 'inline-block';
  document.getElementById('logoutNav').style.display = isLoggedIn
    ? 'inline-block'
    : 'none';
}

function logout() {
  const API_BASE_URL_LOGOUT = `https://localhost:7115/api/v1/account/logout`;
  try {
    const response = axios.get(API_BASE_URL_LOGOUT);
    // console.log(response);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    location.hash = 'login';
    updateNav();
  } catch (error) {
    console.log(error);
  }
}

// updateNav();

// window.onload = () => loadPage('index.html');
