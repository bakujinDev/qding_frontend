interface ISetCookie {
  name: string;
  value: string | number;
  maxAge: number;
}

export function setCookie({ name, value, maxAge }: ISetCookie) {
  document.cookie = `${name}=${value};max-age=${maxAge};`;
}

export function getCookie(name: string) {
  let matches = document.cookie.match(
    new RegExp(
      "(?:^|; )" +
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
        "=([^;]*)"
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

interface IGetViewCookie {
  name: string;
  value: string | number;
}

export function getViewCookie({ name, value }: IGetViewCookie) {
  let min15 = 900;
  getCookie(name);
  setCookie({ name, value, maxAge: min15 });
}
