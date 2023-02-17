interface ISetCookie {
  name: string;
  value: string | number;
  expireSec?: number;
}

export function setLocalStorage({ name, value, expireSec }: ISetCookie) {
  const obj = {
    value: value,
    expire: expireSec ? Date.now() + expireSec : undefined,
  };

  const objString = JSON.stringify(obj);

  window.localStorage.setItem(name, objString);
}

export function getLocalStorage(name: string) {
  if (!window) return;
  
  const objString = window.localStorage.getItem(name);

  if (!objString) return null;

  const obj = JSON.parse(objString);

  if (Date.now() > obj.expire) {
    window.localStorage.removeItem(name);
    return null;
  }

  return obj.value;
}

interface IGetViewCookie {
  name: string;
  value: any;
}

export function setViewLocal({ name, value }: IGetViewCookie) {
  let min15 = 15 * 60 * 10000;

  setLocalStorage({ name, value, expireSec: min15 });
}

export function viewHistory({ name, value }: IGetViewCookie) {
  let _item = getLocalStorage(name) || [];

  if (!_item) _item = [value];
  else {
    _item = [..._item, value];
    _item = _item.filter((v: any, i: number, self: Array<any>) => {
      return i === self.findIndex((t: any) => t.id === v.id);
    });

    console.log(_item);
    _item = [..._item].slice(-5);
  }

  setLocalStorage({ name, value: _item });
}
