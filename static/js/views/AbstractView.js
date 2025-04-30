export default class AbstractView {
  constructor() {
    this.routes = {
      '/login': '../../../pages/login.html',
      '/register': '../../../pages/register.html',
      '/cities': '../../../pages/cities.html',
      '/': '../../../pages/index.html',
      404: '../../../pages/404.html',
    };
  }
  setTitle(title) {
    document.title = title;
  }
  async getHtml() {
    return '';
  }
  async callApi() {
    return '';
  }
}
