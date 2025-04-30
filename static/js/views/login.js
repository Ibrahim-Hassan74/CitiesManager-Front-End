import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Login');
  }
  async getHtml() {
    const path = this.routes[location.pathname];
    const route = path;
    const html = await fetch(route).then((response) => response.text());
    return html;
  }

  async callApi() {
    document
      .getElementById('loginForm')
      .addEventListener('submit', async function (e) {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const API_BASE_URL_LOGIN = `https://localhost:7115/api/v1/account/login`;
        const data = {
          Email: email,
          Password: password,
        };
        console.log(API_BASE_URL_LOGIN);
        try {
          const response = await axios.post(API_BASE_URL_LOGIN, data);
          console.log(response);
          localStorage['token'] = response.data.token;
          localStorage['refreshToken'] = response.data.refreshToken;
          window.location.pathname = '/';
          updateNav();
        } catch (err) {
          console.log(err);
        }
      });
  }
}
