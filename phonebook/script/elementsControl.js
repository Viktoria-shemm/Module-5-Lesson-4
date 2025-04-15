import { getStorage, setStorage, removeStorage } from "./localStorage.js";
import { createRow } from "./createElements.js";

export const modalControl = (btnAdd, formOverlay) => {
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

export const deleteControl = (btnDel, list) => {
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
    if (
      existingContacts.some((contact) => contact.phone === newContact.phone)
    ) {
      alert("Контакт с таким номером уже существует.");
      return;
    }

    addContactPage(newContact, list);
    setStorage("contacts", newContact);
    form.reset();
    closeModal();
  });
};

export default formControl;
