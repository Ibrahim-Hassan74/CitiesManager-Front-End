function initCities() {
  document
    .getElementById('searchButton')
    .addEventListener('click', fetchCities);
  document
    .getElementById('searchInput')
    .addEventListener('keypress', function (e) {
      if (e.key === 'Enter') fetchCities();
    });

  async function fetchCities() {
    const route = document.getElementById('searchInput').value.trim();
    // if (!route) return;

    try {
      const response = await axios.get(
        `https://localhost:7115/api/v1/cities/search/${encodeURIComponent(
          route
        )}`,
        {
          headers: { Authorization: `Bearer ${localStorage['token']}` },
        }
      );

      const cities = response.data;
      console.log(response);
      displayCities(cities);
    } catch (error) {
      console.error('Error fetching cities:', error);
      //   displayMessage('Unauthorized or error fetching data.', 'red');
      //   showLoginMessage();
      displayMessage();
    }
  }

  function displayCities(cities) {
    let resultsContainer = document.getElementById('searchResults');

    if (!resultsContainer) {
      resultsContainer = document.createElement('div');
      resultsContainer.id = 'searchResults';
      resultsContainer.className = 'mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6';
      document.querySelector('main')?.appendChild(resultsContainer);
    }

    resultsContainer.innerHTML = '';

    if (cities.length === 0) {
      //   displayMessage('No cities found.', 'gray');
      displayMessage();
      return;
    }

    cities.forEach((city) => {
      const card = document.createElement('div');
      card.className =
        'bg-white shadow-lg p-6 rounded-xl transition transform hover:scale-105';
      card.innerHTML = `
        <h3 class="text-xl font-semibold text-purple-700">${city.cityName}</h3>
        <p class="text-gray-600 mt-2">City ID: ${city.cityID}</p>
      `;
      resultsContainer.appendChild(card);
    });
  }

  function displayMessage() {
    const div = document.createElement('div');
    div.innerHTML = `   
       <div class="bg-red-500 text-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto mt-8 transform transition-all duration-500 ease-in-out scale-105">
        <h2 class="text-3xl font-extrabold mb-4">Your session has expired!</h2>
        <p class="text-lg mb-6">Your session has ended. Please log in again to continue using the application.</p>
        <div class="mt-6 text-center">
          <a href="#login" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105">Go to Login</a>
        </div>
      </div>`;
    document.getElementById('content').append(div);
  }
  function showLoginMessage() {
    const messageContainer = document.getElementById('content');
    messageContainer.innerHTML = `
      <div class="bg-red-500 text-white p-8 rounded-lg shadow-xl max-w-3xl mx-auto mt-8 transform transition-all duration-500 ease-in-out scale-105">
        <h2 class="text-3xl font-extrabold mb-4">Your session has expired!</h2>
        <p class="text-lg mb-6">Your session has ended. Please log in again to continue using the application.</p>
        <div class="mt-6 text-center">
          <a href="#login" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300 ease-in-out hover:scale-105">Go to Login</a>
        </div>
      </div>
    `;
  }
}
