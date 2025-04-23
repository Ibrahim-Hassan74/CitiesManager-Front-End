async function initLogin() {
  const API_BASE_URL_LOGIN = `https://localhost:7115/api/v1/account/login`;
  document
    .getElementById('loginForm')
    .addEventListener('submit', async function (e) {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const data = {
        Email: email,
        Password: password,
      };
      try {
        const response = await axios.post(API_BASE_URL_LOGIN, data);
        // console.log(response);
        localStorage['token'] = response.data.token;
        localStorage['refreshToken'] = response.data.refreshToken;
        window.location.hash = 'index';
        updateNav();
        // loadPage(`index.html`);
        // window.loadPage = 'index.html';
      } catch (err) {
        console.log(err);
      }
    });
}
