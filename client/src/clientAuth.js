export const setToken = (token) => {
  localStorage.setItem('bookLibraryToken', token);
};

export const getToken = () => {
  return localStorage.getItem('bookLibraryToken');
};

export const removeToken = () => {
  localStorage.removeItem('bookLibraryToken');
};
