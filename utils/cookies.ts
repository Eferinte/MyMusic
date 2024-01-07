export const setCookies = (name: string, value: string, dayAge: number = 7) => {
  document.cookie = `${name}=${value};max-age=${dayAge * 24 * 60 * 60}`;
};
export const getCookies = (name: string) => {
  const regexPattern = new RegExp(
    `(?:(?:^|.*;\s*)${name}\s*\=\s*([^;]*).*$)|^.*$`
  );
  return document.cookie.replace(regexPattern, "$1");
};

export const removeCookie = (name: string) => {
  document.cookie = `${name}=";max-age=${1}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};
