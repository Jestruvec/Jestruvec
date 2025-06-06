const createStorageService = () => {
  const setItem = <T>(key: string, value: T, stringify = true) => {
    try {
      localStorage.setItem(
        key,
        stringify ? JSON.stringify(value) : (value as string)
      );
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      }
    }
  };
  const getItem = <T>(key: string, parseJson = true): T | null => {
    try {
      const value = localStorage.getItem(key);
      if (!value) return null;

      return parseJson ? (JSON.parse(value) as T) : (value as T);
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return null;
    }
  };
  const removeItem = (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (error instanceof Error) {
        throw Error(error.message);
      }
    }
  };

  return { setItem, getItem, removeItem };
};

export const storageService = createStorageService();
