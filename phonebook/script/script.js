"use strict";
{
  const createContainer = () => {
    const container = document.createElement("div");

    container.classList.add("container");

    return container;
  };

  const createHeader = () => {
    const header = document.createElement("header");
    header.classList.add("header");

    const headerContainer = createContainer();
    header.append(headerContainer);

    header.headerContainer = headerContainer;

    return header;
  };

  const createLogo = (title) => {
    const h1 = document.createElement("h1");
    h1.classList.add("logo");

    h1.textContent = `Телефонный справочник. ${title}`;

    return h1;
  };

  const createMain = () => {
    const main = document.createElement("main");
    const mainContainer = createContainer();

    main.append(mainContainer);

    main.mainContainer = mainContainer;

    return main;
  };

  const createButtonsGroup = (params) => {
    const btnWrapper = document.createElement("div");
    btnWrapper.classList.add("btn-wrapper");

    const btns = params.map(({ className, type, text }) => {
      const button = document.createElement("button");

      button.type = type;
      button.textContent = text;
      button.className = className;

      return button;
    });

    btnWrapper.append(...btns);

    return {
      btnWrapper,
      btns,
    };
  };

  const createTable = () => {
    const table = document.createElement("table");
    table.classList.add("table", "table-striped");

    const thead = document.createElement("thead");
    thead.insertAdjacentHTML(
      "beforeend",
      `
            <tr>
              <th class="delete">Удалить</th>
              <th>Имя</th>
              <th>Фамилия</th>
              <th>Телефон</th>
            </tr>
       `
    );

    const tbody = document.createElement("tbody");

    table.append(thead, tbody);
    table.tbody = tbody;

    return table;
  };

  const createForm = () => {
    const overlay = document.createElement("div");
    overlay.classList.add("form-overlay");

    const form = document.createElement("form");
    form.classList.add("form");
    form.insertAdjacentHTML(
      "beforeend",
      `
              <button type="button" class="close"></button>
              <h2 class="form-title">Добавить контакт</h2>
              <div class="form-group">
                <label for="name" class="form-label">Имя:</label>
                <input type="text" class="form-input" name="name" id="name" required>
                <label for="surname" class="form-label">Фамилия:</label>
                <input type="text" class="form-input" name="surname" id="surname" required>
                <label for="phone" class="form-label">Телефон:</label>
                <input type="number" class="form-input" name="phone" id="phone" required>
              </div>
       `
    );

    const btnClose = form.querySelector(".close");

    const buttonGroup = createButtonsGroup([
      {
        className: "btn btn-primary mr-3",
        type: "submit",
        text: "Добавить",
      },
      {
        className: "btn btn-danger",
        type: "reset",
        text: "Отмена",
      },
    ]);

    form.append(...buttonGroup.btns);

    overlay.append(form);

    return {
      overlay,
      form,
      btnCancel: buttonGroup.btns[1],
      btnClose,
    };
  };

  const getStorage = (key) => {
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : [];
  };

  const setStorage = (key, newObject) => {
    const data = getStorage(key);
    data.push(newObject);
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createRow = ({ name, surname, phone }) => {
    const tr = document.createElement("tr");
    tr.classList.add("contact");

    const tdDel = document.createElement("td");
    tdDel.classList.add("delete");
    const buttonDel = document.createElement("button");
    buttonDel.classList.add("del-icon");
    tdDel.append(buttonDel);

    const tdName = document.createElement("td");
    tdName.textContent = name;

    const tdSurname = document.createElement("td");
    tdSurname.textContent = surname;

    const tdPhone = document.createElement("td");
    const phoneLink = document.createElement("a");
    phoneLink.href = `tel:${phone}`;
    phoneLink.textContent = phone;
    tr.phoneLink = phoneLink;
    tdPhone.append(phoneLink);

    tr.append(tdDel, tdName, tdSurname, tdPhone);

    return tr;
  };

  const renderContacts = (elem, data) => {
    const allRow = data.map(createRow);
    elem.append(...allRow);
    return allRow;
  };

  const data = getStorage('contacts');

  const createFooter = (title) => {
    const footer = document.createElement("footer");
    footer.classList.add("footer");

    const footerContainer = createContainer();
    footerContainer.classList.add("container");

    footer.append(footerContainer);
    footerContainer.textContent = `Все права защищены Ⓒ${title}`;

    return footer;
  };

  const renderPhoneBook = (app, title) => {
    const header = createHeader();
    const logo = createLogo(title);
    const main = createMain();
    const buttonGroup = createButtonsGroup([
      {
        className: "btn btn-primary mr-3",
        type: "button",
        text: "Добавить",
      },
      {
        className: "btn btn-danger",
        type: "button",
        text: "Удалить",
      },
    ]);
    const table = createTable();
    const { form, overlay } = createForm();
    const footer = createFooter(title);

    header.headerContainer.append(logo);
    main.mainContainer.append(buttonGroup.btnWrapper, table, overlay);
    app.append(header, main, footer);

    return {
      list: table.tbody,
      logo,
      btnAdd: buttonGroup.btns[0],
      btnDel: buttonGroup.btns[1],
      formOverlay: overlay,
      form,
      btnCancel: form.btnCancel,
      btnClose: form.btnClose,
    };
  };

  const hoverRow = (allRow, logo) => {
    const text = logo.textContent;
    allRow.forEach((contact) => {
      contact.addEventListener("mouseenter", () => {
        logo.textContent = contact.phoneLink.textContent;
      });
      contact.addEventListener("mouseleave", () => {
        logo.textContent = text;
      });
    });
  };

  const modalControl = (btnAdd, formOverlay) => {
    const openModal = () => {
      formOverlay.classList.add("is-visible");
    };

    const closeModal = () => {
      formOverlay.classList.remove("is-visible");
    };

    btnAdd.addEventListener("click", openModal);

    formOverlay.addEventListener("click", (e) => {
      const target = e.target;
      if (
        target === formOverlay ||
        target.closest(".close") ||
        target.closest(".btn-danger")
      ) {
        closeModal();
      }
    });

    return {
      closeModal,
    };
  };

  const removeStorage = (key, number) => {
    const currentData = getStorage(key);
    const updatedData = currentData.filter(
      (contact) => contact.phone !== number
    );
    localStorage.setItem(key, JSON.stringify(updatedData));
  };

  const deleteControl = (btnDel, list) => {
    btnDel.addEventListener("click", () => {
      document.querySelectorAll(".delete").forEach((del) => {
        del.classList.toggle("is-visible");
      });
    });

    list.addEventListener("click", (e) => {
      const target = e.target;

      if (target.closest(".del-icon")) {
        target.closest(".contact").remove();
      }

      const number = target.closest(".contact").querySelector("a").textContent;
      
      removeStorage("contacts", number);
    });
  };

  const addContactPage = (contact, list) => {
    list.append(createRow(contact));
  };

  const formControl = (form, list, closeModal) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target;
      const formData = new FormData(target);

      const newContact = Object.fromEntries(formData);

      const existingContacts = getStorage("contacts");
      if (existingContacts.some(contact => contact.phone === newContact.phone)) {
        alert("Контакт с таким номером уже существует.");
        return;
      }

      addContactPage(newContact, list);
      setStorage("contacts", newContact);
      form.reset();
      closeModal();
    });
  };

  const init = (selectorApp, title) => {
    const app = document.querySelector(selectorApp);

    const { list, logo, btnAdd, formOverlay, btnDel, form } = renderPhoneBook(
      app,
      title
    );

    //Функционал

    const allRow = renderContacts(list, data);
    const { closeModal } = modalControl(btnAdd, formOverlay);

    hoverRow(allRow, logo);
    deleteControl(btnDel, list);
    formControl(form, list, closeModal);
  };

  window.phoneBookInit = init;
}
