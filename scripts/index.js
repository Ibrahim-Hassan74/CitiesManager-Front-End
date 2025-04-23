function initIndex() {
  const API_BASE_URL = `https://localhost:7115/api/v1/cities`;

  const cityForm = document.getElementById('cityForm');
  const cityInput = document.getElementById('cityInput');
  const cityTableBody = document.getElementById('cityTableBody');

  fetchCities();

  cityForm?.addEventListener('submit', async function (e) {
    e.preventDefault();
    const city = cityInput.value.trim();
    if (!city) return;

    try {
      await axios.post(
        API_BASE_URL,
        { cityName: city },
        {
          headers: { Authorization: `Bearer ${localStorage['token']}` },
        }
      );
      cityInput.value = '';
      fetchCities();
    } catch (error) {
      console.error(error);
    }
  });

  async function fetchCities() {
    const dis =
      document.getElementById('logoutNav').style.display !== 'none'
        ? true
        : false;
    // console.log(dis);
    document.getElementById('table-container').style.display = dis
      ? 'block'
      : 'none';
    document.getElementById('form-control').style.display = dis
      ? 'block'
      : 'none';
    try {
      const res = await axios.get(API_BASE_URL, {
        headers: { Authorization: `Bearer ${localStorage['token']}` },
      });
      const cities = res.data;
      cityTableBody.innerHTML = '';
      cities.forEach((city, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
              <td class="py-2 px-4 border-b">${index + 1}</td>
              <td class="py-2 px-4 border-b">${city.cityName}</td>
              <td class="py-2 px-4 border-b space-x-2">
                <button onclick="updateCity('${
                  city.cityID
                }')" class="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">Update</button>
                <button onclick="deleteCity('${
                  city.cityID
                }')" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
              </td>
            `;
        cityTableBody.appendChild(row);
        //  document.getElementById('logoutNav');
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        showLoginMessage();
      }
    }
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

  function hideModal(modalId, boxId) {
    const modal = document.getElementById(modalId);
    const box = document.getElementById(boxId);
    box.classList.add('scale-95', 'opacity-0');
    box.classList.remove('scale-100', 'opacity-100');
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }

  function showModal(modalId, boxId) {
    const modal = document.getElementById(modalId);
    const box = document.getElementById(boxId);
    modal.classList.remove('hidden');
    setTimeout(() => {
      box.classList.remove('scale-95', 'opacity-0');
      box.classList.add('scale-100', 'opacity-100');
    }, 10);
  }

  window.updateCity = function (id) {
    currentCityIdToUpdate = id;
    showModal('updateModal', 'updateModalBox');
  };

  window.closeUpdateModal = function () {
    hideModal('updateModal', 'updateModalBox');
    document.getElementById('updateCityInput').value = '';
  };

  window.confirmUpdateCity = async function () {
    const newName = document.getElementById('updateCityInput').value.trim();
    // console.log(newName, currentCityIdToUpdate);
    if (!newName) return;

    try {
      await axios.put(
        `https://localhost:7115/api/v1/cities/${currentCityIdToUpdate}`,
        { cityID: currentCityIdToUpdate, cityName: newName },
        {
          headers: { Authorization: `Bearer ${localStorage['token']}` },
        }
      );
      closeUpdateModal();
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };

  window.deleteCity = function (id) {
    currentCityIdToDelete = id;
    showModal('deleteModal', 'deleteModalBox');
  };

  window.closeDeleteModal = function () {
    hideModal('deleteModal', 'deleteModalBox');
  };

  window.confirmDeleteCity = async function () {
    try {
      await axios.delete(
        `https://localhost:7115/api/v1/cities/${currentCityIdToDelete}`,
        {
          headers: { Authorization: `Bearer ${localStorage['token']}` },
        }
      );
      closeDeleteModal();
      fetchCities();
    } catch (err) {
      console.error(err);
    }
  };
}
