// function loadPage(page) {
//   fetch(`pages/${page}`)
//     .then((res) => res.text())
//     .then((html) => {
//       const contentDiv = document.getElementById('content');
//       contentDiv.innerHTML = html;

//       const pageName = page.split('.')[0];

//       const scriptPath = `scripts/${pageName}.js`;
//       // console.log(document.querySelector(`script[src="${scriptPath}"]`));
//       if (!document.querySelector(`script[src="${scriptPath}"]`)) {
//         const script = document.createElement('script');
//         script.src = scriptPath;
//         script.onload = () => {
//           if (typeof window[`init${capitalize(pageName)}`] === 'function') {
//             window[`init${capitalize(pageName)}`]();
//           }
//         };
//         document.body.appendChild(script);
//       } else {
//         if (typeof window[`init${capitalize(pageName)}`] === 'function') {
//           window[`init${capitalize(pageName)}`]();
//         }
//       }
//       location.hash = pageName;
//       // console.log(pageName);
//     });
// }

const route = (e) => {
  e = e || window.event;
  e.preventDefault();
  window.history.pushState({}, '', e.target.href);
  handelLocation();
};

const routes = {
  '/': '/pages/index.html',
  '/cities': '/pages/cities.html',
  '/login': '/pages/login.html',
  '/register': '/pages/register.html',
  404: '/pages/404.html',
};

const handelLocation = async () => {
  const path = window.location.pathname;
  const route = routes[path] || routes[404];
  const html = await fetch(route).then((response) => response.text());
  document.getElementById('content').innerHTML = html;
};

window.onpopstate = handelLocation;
window.route = route;
handelLocation();
