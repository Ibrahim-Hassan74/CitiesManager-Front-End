import AbstractView from './AbstractView.js';

export default class extends AbstractView {
  constructor() {
    super();
    this.setTitle('Register');
    this.API_BASE_URL_REGISTER = `https://localhost:7115/api/v1/account/register`;
  }
  async getHtml() {
    const path = this.routes[location.pathname];
    const route = path;
    const html = await fetch(route).then((response) => response.text());
    return html;
  }

  async callApi() {
    const form = document.getElementById('registerForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const personName = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phoneNumber = document.getElementById('phone').value.trim();
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirmPassword').value;
      const messageBox = document.getElementById('registerMessage');

      if (password !== confirmPassword) {
        messageBox.textContent = 'Passwords do not match.';
        return;
      }

      const data = {
        personName,
        email,
        phoneNumber,
        password,
        confirmPassword,
      };

      try {
        const response = await axios.post(this.API_BASE_URL_REGISTER, data);
        messageBox.style.color = 'green';
        messageBox.textContent = 'Registered successfully!';
        localStorage['token'] = response.data.token;
        localStorage['refreshToken'] = response.data.refreshToken;
        window.location.pathname = '/';
        updateNav();
      } catch (error) {
        console.error(error);
        messageBox.textContent =
          error.response?.data?.message || 'Registration failed.';
      }
    });
  }
}
