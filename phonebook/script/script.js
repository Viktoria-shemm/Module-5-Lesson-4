import { renderPhoneBook, renderContacts } from "./elementsRender.js";
import * as control from "./elementsControl.js";
import { hoverRow } from "./createElements.js";
import { data } from "./localStorage.js";

const init = (selectorApp, title) => {
  const app = document.querySelector(selectorApp);

  const { list, logo, btnAdd, formOverlay, btnDel, form } = renderPhoneBook(
    app,
    title
  );

  //Функционал

  const allRow = renderContacts(list, data);
  const { closeModal } = control.modalControl(btnAdd, formOverlay);

  hoverRow(allRow, logo);
  control.deleteControl(btnDel, list);
  control.default(form, list, closeModal);
};

window.phoneBookInit = init;
