const API = process.env.REACT_APP_API;
const getFullPath = (options) => {
  if (options.uploads) {
    return `${API}/uploads${options.uploads}`;
  }

  return API;
};

export { getFullPath };
