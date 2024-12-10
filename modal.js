document.addEventListener("DOMContentLoaded", function () {
  const issueCarBtn = document.getElementById("issue-car");
  const issueCarModal = document.getElementById("issue-car-modal");
  const issueCarForm = document.getElementById("issue-car-form");
  const closeBtns = document.querySelectorAll(".close-btn");

  const cars = [
    {
      id: 1,
      brand: "Toyota",
      model: "Camry",
      year: 2020,
      bodyType: "Седан",
      price: "30000/Місяць",
    },
    {
      id: 2,
      brand: "Honda",
      model: "Civic",
      year: 2019,
      bodyType: "Седан",
      price: "25000/Місяць",
    },
    {
      id: 3,
      brand: "BMW",
      model: "X5",
      year: 2021,
      bodyType: "Кросовер",
      price: "40000/Місяць",
    },
    {
      id: 4,
      brand: "Mercedes-Benz",
      model: "C-Class",
      year: 2020,
      bodyType: "Седан",
      price: "35000/Місяць",
    },
    {
      id: 5,
      brand: "Ford",
      model: "Explorer",
      year: 2020,
      bodyType: "Позашляховик",
      price: "38000/Місяць",
    },
  ];

  const rentals = [
    {
      id: 1,
      renterName: "Іван Іванов",
      carId: 1,
      rentDate: "2024-07-01",
      returnDate: null,
    },
    {
      id: 2,
      renterName: "Петро Петров",
      carId: 2,
      rentDate: "2024-07-05",
      returnDate: "2024-07-10",
    },
    {
      id: 3,
      renterName: "Марія Сидорова",
      carId: 1,
      rentDate: "2024-07-07",
      returnDate: null,
    },
    {
      id: 4,
      renterName: "Олексій Коваленко",
      carId: 2,
      rentDate: "2024-07-10",
      returnDate: "2024-07-20",
    },
    {
      id: 5,
      renterName: "Наталія Петренко",
      carId: 3,
      rentDate: "2024-07-15",
      returnDate: null,
    },
  ];

  // Открытие модального окна
  issueCarBtn.addEventListener("click", function () {
    fillCarOptions();
    issueCarModal.style.display = "block";
  });

  // Закрытие модального окна
  closeBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      issueCarModal.style.display = "none";
    });
  });

  // Закрытие при клике вне модального окна
  window.addEventListener("click", function (event) {
    if (event.target == issueCarModal) {
      issueCarModal.style.display = "none";
    }
  });

  // Отправка формы выдачи автомобиля
  issueCarForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const renterName = document.getElementById("issue-car-renter").value;
    const carId = document.getElementById("issue-car-car").value;
    const rentDate = document.getElementById("issue-car-rent-date").value;
    const returnDate = document.getElementById("issue-car-return-date").value;

    // Логика для добавления записи о выдаче автомобиля
    addRentalRecord(renterName, carId, rentDate, returnDate);

    issueCarModal.style.display = "none";
    updateStatistics(); // Обновить статистику после добавления аренды
  });

  function fillCarOptions() {
    const carSelect = document.getElementById("issue-car-car");
    carSelect.innerHTML = "";

    cars.forEach((car) => {
      const option = document.createElement("option");
      option.value = car.id;
      option.textContent = `${car.brand} ${car.model} (${car.year})`;
      carSelect.appendChild(option);
    });
  }

  function getNextRentalId() {
    if (rentals.length === 0) return 1;
    return Math.max(...rentals.map((r) => r.id)) + 1;
  }

  function addRentalRecord(renterName, carId, rentDate, returnDate) {
    const newId = getNextRentalId();
    const newRental = { id: newId, renterName, carId, rentDate, returnDate };
    rentals.push(newRental);

    const table = document.getElementById("card-list").querySelector("tbody");
    const row = table.insertRow();

    const car = cars.find((c) => c.id == carId);

    row.innerHTML = `
          <td>${newId}</td>
          <td>${renterName}</td>
          <td>${car.brand} ${car.model}</td>
          <td>${rentDate}</td>
          <td>${returnDate}</td>
          <td>
              <button class="edit-btn" data-id="${newId}">Редагувати</button>
              <button class="delete-btn" data-id="${newId}">Видалити</button>
          </td>
      `;
  }

  // Делегирование событий для кнопок редактирования и удаления
  document
    .getElementById("card-list")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("edit-btn")) {
        const id = event.target.dataset.id;
        // Логика для редактирования записи аренды
      } else if (event.target.classList.contains("delete-btn")) {
        const id = event.target.dataset.id;
        // Логика для удаления записи аренды
        deleteRentalRecord(id);
        updateStatistics();
      }
    });

  function deleteRentalRecord(id) {
    const index = rentals.findIndex((rental) => rental.id == id);
    if (index !== -1) {
      rentals.splice(index, 1);
      document.querySelector(`[data-id="${id}"]`).closest("tr").remove();
    }
  }

  function updateStatistics() {
    const carStats = {};
    const renterStats = {};

    // Считать аренды
    rentals.forEach((rental) => {
      carStats[rental.carId] = (carStats[rental.carId] || 0) + 1;
      renterStats[rental.renterName] =
        (renterStats[rental.renterName] || 0) + 1;
    });

    // Найти 5 самых популярных автомобилей
    const topCars = Object.entries(carStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([carId, count]) => {
        const car = cars.find((c) => c.id == carId);
        return `${car.brand} ${car.model} - ${count} раз(и)`;
      });

    // Найти 5 самых активных арендаторов
    const topRenters = Object.entries(renterStats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([renterName, count]) => `${renterName} - ${count} раз(и)`);

    // Обновить DOM
    const topCarsList = document.getElementById("top-cars");
    const topRentersList = document.getElementById("top-renters");

    topCarsList.innerHTML = topCars.map((car) => `<li>${car}</li>`).join("");
    topRentersList.innerHTML = topRenters
      .map((renter) => `<li>${renter}</li>`)
      .join("");
  }

  // Инициализация статистики при загрузке страницы
  updateStatistics();
});
