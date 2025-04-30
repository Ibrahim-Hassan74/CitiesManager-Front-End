import cities from './views/cities.js';
import index from './views/index.js';
import login from './views/login.js';
import register from './views/register.js';

const router = async () => {
  const routes = [
    { path: '/', view: index },
    { path: '/cities', view: cities },
    { path: '/login', view: login },
    { path: '/register', view: register },
  ];

  const p = routes.map((route) => {
    return {
      route: route,
      isMatch: route.path == location.pathname,
    };
  });
  let match = p.find((x) => x.isMatch);
  if (!match) {
    match = {
      route: routes[0],
      isMatch: true,
    };
  }
  console.log(match);
  const view = new match.route.view();
  document.querySelector('#content').innerHTML = await view.getHtml();
  updateNav();
  if (isLoggedIn()) {
    await view.callApi();
  }

  // console.log(match.route.view());
};

const navigateTo = (url) => {
  history.pushState(null, null, url);
  router();
  updateNav();
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('[data-link]')) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  router();
  updateNav();
});

window.addEventListener('popstate', router);

window.addEventListener('load', () => {
  updateNav();
});

async function isLoggedIn() {
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
  return isLoggedIn;
}
async function updateNav() {
  const check = await isLoggedIn();
  document.getElementById('loginNav').style.display = check
    ? 'none'
    : 'inline-block';
  document.getElementById('registerNav').style.display = check
    ? 'none'
    : 'inline-block';
  document.getElementById('logoutNav').style.display = check
    ? 'inline-block'
    : 'none';
}

function logout() {
  const API_BASE_URL_LOGOUT = `https://localhost:7115/api/v1/account/logout`;
  try {
    const response = axios.get(API_BASE_URL_LOGOUT);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    location.pathname = '/';
    updateNav();
  } catch (error) {
    console.log(error);
  }
}
