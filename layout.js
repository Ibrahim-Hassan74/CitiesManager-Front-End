function loadPage(page) {
  fetch(`pages/${page}`)
    .then((res) => res.text())
    .then((html) => {
      const contentDiv = document.getElementById('content');
      contentDiv.innerHTML = html;

      const pageName = page.split('.')[0];

      const scriptPath = `scripts/${pageName}.js`;
      // console.log(document.querySelector(`script[src="${scriptPath}"]`));
      if (!document.querySelector(`script[src="${scriptPath}"]`)) {
        const script = document.createElement('script');
        script.src = scriptPath;
        script.onload = () => {
          if (typeof window[`init${capitalize(pageName)}`] === 'function') {
            window[`init${capitalize(pageName)}`]();
          }
        };
        document.body.appendChild(script);
      } else {
        if (typeof window[`init${capitalize(pageName)}`] === 'function') {
          window[`init${capitalize(pageName)}`]();
        }
      }
      location.hash = pageName;
      // console.log(pageName);
    });
}
