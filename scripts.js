document.addEventListener("DOMContentLoaded", () => {
  // Данные
  let carList = [
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

  let renterList = [
    { id: 1, name: "Іван Іванов", phone: "123-456-789" },
    { id: 2, name: "Петро Петров", phone: "987-654-321" },
    { id: 3, name: "Марія Сидорова", phone: "111-222-333" },
    { id: 4, name: "Олексій Коваленко", phone: "444-555-666" },
    { id: 5, name: "Наталія Петренко", phone: "777-888-999" },
  ];

  let cardList = [
    { id: 1, renterId: 1, carId: 1, rentDate: "2024-07-01", returnDate: null },
    {
      id: 2,
      renterId: 2,
      carId: 2,
      rentDate: "2024-07-05",
      returnDate: "2024-07-10",
    },
    { id: 3, renterId: 3, carId: 3, rentDate: "2024-07-07", returnDate: null },
    {
      id: 4,
      renterId: 4,
      carId: 4,
      rentDate: "2024-07-10",
      returnDate: "2024-07-20",
    },
    { id: 5, renterId: 5, carId: 5, rentDate: "2024-07-15", returnDate: null },
  ];

  // Модальные окна
  const modals = {
    addCar: document.getElementById("add-car-modal"),
    addRenter: document.getElementById("add-renter-modal"),
    editCard: document.getElementById("edit-card-modal"),
    editRenter: document.getElementById("renter-modal"),
  };

  // Общая функция для управления модальными окнами
  function toggleModal(modal, show) {
    modal.style.display = show ? "block" : "none";
    if (show) {
      modal.scrollIntoView({ behavior: "smooth" });
    }
  }

  // Закрытие модальных окон
  document
    .querySelectorAll(".modal .close-btn")
    .forEach((btn) =>
      btn.addEventListener("click", () =>
        toggleModal(btn.closest(".modal"), false)
      )
    );

  window.addEventListener("click", (event) => {
    if (Object.values(modals).includes(event.target)) {
      toggleModal(event.target, false);
    }
  });

  // Показ модальных окон
  document
    .getElementById("add-car-btn")
    .addEventListener("click", () => toggleModal(modals.addCar, true));
  document
    .getElementById("add-renter-btn")
    .addEventListener("click", () => toggleModal(modals.addRenter, true));

  // Обработчики добавления данных
  document
    .getElementById("add-car-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const newCar = {
        id: carList.length + 1,
        brand: document.getElementById("add-car-brand").value,
        model: document.getElementById("add-car-model").value,
        year: document.getElementById("add-car-year").value,
        bodyType: document.getElementById("add-car-body-type").value,
        price: document.getElementById("add-car-price").value,
      };
      carList.push(newCar);
      toggleModal(modals.addCar, false);
      filterAndSortCars();
    });

  document
    .getElementById("add-renter-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const newRenter = {
        id: renterList.length + 1,
        name: document.getElementById("add-renter-name").value,
        phone: document.getElementById("add-renter-phone").value,
      };
      renterList.push(newRenter);
      toggleModal(modals.addRenter, false);
      filterAndSortRenters();
    });

  // Функция отображения данных автомобилей
  function filterAndSortCars() {
    const searchValue = document.getElementById("search").value.toLowerCase();
    const sortValue = document.getElementById("sort").value;
    const carTableBody = document.querySelector("#car-list tbody");
    carTableBody.innerHTML = "";

    let filteredCars = carList.filter(
      (car) =>
        car.brand.toLowerCase().includes(searchValue) ||
        car.model.toLowerCase().includes(searchValue) ||
        car.year.toString().includes(searchValue) ||
        car.bodyType.toLowerCase().includes(searchValue) ||
        car.price.toLowerCase().includes(searchValue)
    );

    filteredCars.sort((a, b) => {
      if (a[sortValue] < b[sortValue]) return -1;
      if (a[sortValue] > b[sortValue]) return 1;
      return 0;
    });

    filteredCars.forEach((car) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${car.brand}</td>
          <td>${car.model}</td>
          <td>${car.year}</td>
          <td>${car.bodyType}</td>
          <td>${car.price}</td>
          <td><button class="delete-car-btn" data-id="${car.id}">Видалити</button></td>
        `;
      carTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-car-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const carId = parseInt(event.target.getAttribute("data-id"));
        carList = carList.filter((car) => car.id !== carId);
        filterAndSortCars();
      });
    });
  }

  // Функция отображения данных арендаторов
  function filterAndSortRenters() {
    const searchValue = document
      .getElementById("renter-search")
      .value.toLowerCase();
    const sortValue = document.getElementById("renter-sort").value;
    const renterTableBody = document.querySelector("#renter-list tbody");
    renterTableBody.innerHTML = "";

    let filteredRenters = renterList.filter(
      (renter) =>
        renter.name.toLowerCase().includes(searchValue) ||
        renter.phone.includes(searchValue)
    );

    filteredRenters.sort((a, b) => {
      if (a[sortValue] < b[sortValue]) return -1;
      if (a[sortValue] > b[sortValue]) return 1;
      return 0;
    });

    filteredRenters.forEach((renter) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${renter.id}</td>
          <td>${renter.name}</td>
          <td>${renter.phone}</td>
          <td><button class="delete-renter-btn" data-id="${renter.id}">Видалити</button></td>
        `;
      renterTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-renter-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const renterId = parseInt(event.target.getAttribute("data-id"));
        renterList = renterList.filter((renter) => renter.id !== renterId);
        filterAndSortRenters();
      });
    });

    document.querySelectorAll(".edit-renter-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const renterId = parseInt(event.target.getAttribute("data-id"));
        showEditRenterModal(renterId);
      });
    });
  }

  // Функция отображения данных карточек аренды
  function displayRentCards() {
    const cardTableBody = document.querySelector("#card-list tbody");
    cardTableBody.innerHTML = "";

    cardList.forEach((card) => {
      const renter = renterList.find((r) => r.id === card.renterId);
      const car = carList.find((c) => c.id === card.carId);
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${card.id}</td>
          <td>${renter ? renter.name : "Невідомий"}</td>
          <td>${car ? car.brand + " " + car.model : "Невідомий"}</td>
          <td>${card.rentDate}</td>
          <td>${card.returnDate || "Не повернуто"}</td>
          <td><button class="edit-card-btn" data-id="${
            card.id
          }">Редагувати</button> <button class="delete-card-btn" data-id="${
        card.id
      }">Видалити</button></td>
        `;
      cardTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-card-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const cardId = parseInt(event.target.getAttribute("data-id"));
        cardList = cardList.filter((card) => card.id !== cardId);
        displayRentCards();
      });
    });

    document.querySelectorAll(".edit-card-btn").forEach((button) => {
      button.addEventListener("click", (event) => {
        const cardId = parseInt(event.target.getAttribute("data-id"));
        showEditCardModal(cardId);
      });
    });
  }

  function showEditCardModal(cardId) {
    const card = cardList.find((c) => c.id === cardId);
    if (card) {
      document.getElementById("edit-card-id").value = card.id;
      const renterSelect = document.getElementById("edit-card-renter");
      const carSelect = document.getElementById("edit-card-car");
      renterSelect.innerHTML = renterList
        .map(
          (renter) =>
            `<option value="${renter.id}" ${
              renter.id === card.renterId ? "selected" : ""
            }>${renter.name}</option>`
        )
        .join("");
      carSelect.innerHTML = carList
        .map(
          (car) =>
            `<option value="${car.id}" ${
              car.id === card.carId ? "selected" : ""
            }>${car.brand} ${car.model}</option>`
        )
        .join("");
      document.getElementById("edit-card-rent-date").value = card.rentDate;
      document.getElementById("edit-card-return-date").value =
        card.returnDate || "";
      toggleModal(modals.editCard, true);
    }
  }

  document
    .getElementById("edit-card-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const cardId = parseInt(document.getElementById("edit-card-id").value);
      const updatedCard = {
        id: cardId,
        renterId: parseInt(document.getElementById("edit-card-renter").value),
        carId: parseInt(document.getElementById("edit-card-car").value),
        rentDate: document.getElementById("edit-card-rent-date").value,
        returnDate:
          document.getElementById("edit-card-return-date").value || null,
      };
      const index = cardList.findIndex((c) => c.id === cardId);
      if (index !== -1) {
        cardList[index] = updatedCard;
      }
      toggleModal(modals.editCard, false);
      displayRentCards();
    });

  // Инициализация отображения
  filterAndSortCars();
  filterAndSortRenters();
  displayRentCards();

  // Обработчики поиска и сортировки
  document
    .getElementById("search")
    .addEventListener("input", filterAndSortCars);
  document.getElementById("sort").addEventListener("change", filterAndSortCars);
  document
    .getElementById("renter-search")
    .addEventListener("input", filterAndSortRenters);
  document
    .getElementById("renter-sort")
    .addEventListener("change", filterAndSortRenters);

  // Обработчики перехода между разделами
  const navLinks = document.querySelectorAll("nav ul li a");
  const sections = document.querySelectorAll("main section");

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.getAttribute("data-section");
      sections.forEach((section) => {
        section.classList.remove("active");
      });
      const targetSection = document.getElementById(sectionId);
      targetSection.classList.add("active");
      targetSection.scrollIntoView({ behavior: "smooth" });
    });
  });
});
