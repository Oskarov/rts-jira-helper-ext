const pkg = {
  name: 'atms'
};

/*const checkStorageAvailability = (storage: Storage) => {
  const ITEM_TO_CREATE = '__item__';

  try {
    storage.setItem(ITEM_TO_CREATE, ITEM_TO_CREATE);
    storage.removeItem(ITEM_TO_CREATE);
    return true;
  } catch (e) {
    return false;
  }
};*/

export class LocalOrSessionStorage implements Storage {
  private _storage: Storage | undefined;

  private _data: Record<string, any> = {};

  constructor(
    // eslint-disable-next-line no-unused-vars
    private _prefix: string = 'storage',
    // eslint-disable-next-line no-unused-vars
    private _nativeLocalStorage: Storage = window.localStorage,
  ) {
      this._storage = this._nativeLocalStorage
  }

  get length() {
    return Object.keys(this._getPrefix()).length;
  }

  key(index: number) {
    const data = this._getPrefix();
    return Object.keys(data)[index];
  }

  getItem(key: string) {
    const data = this._data[key] ? this._data : this._getPrefix();
    return data[key];
  }

  setItem(key: string, value: any) {
    const data = this._getPrefix();
    data[key] = value;
    this._setPrefix(data);
  }

  removeItem(key: string) {
    const data = this._getPrefix();

    delete data[key];
    this._setPrefix(data);
  }

  clear() {
    this._setPrefix({});
  }

  private _getPrefix() {
    if (this._storage) {
      const json = this._storage.getItem(this._prefix) || '';

      try {
        this._data = JSON.parse(json);
        return this._data;
      } catch (e) {
        return {};
      }
    } else {
      return this._data;
    }
  }

  private _setPrefix(data: any) {
    if (this._storage) {
      this._storage.setItem(this._prefix, JSON.stringify(data));
    }
    this._data = data;
  }
}

let applicationStorage: LocalOrSessionStorage;


applicationStorage = new LocalOrSessionStorage(pkg.name, window.localStorage);

export default applicationStorage;
