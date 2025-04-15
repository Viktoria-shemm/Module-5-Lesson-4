export const getStorage = (key) => {
  return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : [];
};

export const setStorage = (key, newObject) => {
  const data = getStorage(key);
  data.push(newObject);
  localStorage.setItem(key, JSON.stringify(data));
};

export const data = getStorage("contacts");

export const removeStorage = (key, number) => {
  const currentData = getStorage(key);
  const updatedData = currentData.filter((contact) => contact.phone !== number);
  localStorage.setItem(key, JSON.stringify(updatedData));
};
