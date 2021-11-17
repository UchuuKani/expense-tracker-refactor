import { ITransaction, ITag, IUser } from "../../src/types";

interface IError {
  message?: string;
  status?: number;
}

interface TempStore {
  [id: number]: ITransaction | ITag | IUser;
}

const testTagOne: ITag = {
  id: 1,
  tag_name: "Food",
};

const testUserOne: IUser = {
  id: 1,
  name: "Steve",
  email: "st@example.com",
  password: "poggers1",
};

const testTransactionOne: ITransaction = {
  id: 1,
  user_id: testUserOne.id,
  description: "Stuff",
  amount: 5000,
  transaction_date: new Date("2021-05-13"),
  tags: [{ ...testTagOne }],
};

export const tempTransactionStore = {
  1: { ...testTransactionOne },
};

export const tempTagStore = {
  1: {
    ...testTagOne,
  },
};

export const tempUserStore = {
  1: {
    ...testUserOne,
  },
};

// utility methods
export const getLastIntKey = (entityStore: TempStore): number | undefined => {
  const entityStoreKeys = Object.keys(entityStore);
  const entitySize = entityStoreKeys?.length;

  const entityKeyAsStr = [...entityStoreKeys]?.sort()?.[entitySize - 1];

  return !isNaN(parseInt(entityKeyAsStr))
    ? parseInt(entityKeyAsStr)
    : undefined;
};

export const getKeyInEntity = (entityStore: TempStore, key: number) => {
  return entityStore?.[key];
};

// POST a new entity
export const addToEntity = (
  entityName: string,
  keyId: number,
  payload: any
): IError | any => {
  switch (true) {
    case entityName === "TRANSACTION": {
      const lastTransactionKey = getLastIntKey(tempTransactionStore);

      if (lastTransactionKey) {
        const keyPlusOne = lastTransactionKey + 1;
        tempTransactionStore[keyId] = { ...payload };

        return payload;
      }

      const notFoundTransaction: IError = {
        message: `Could not find an existing key`,
        status: 500,
      };

      return notFoundTransaction;
    }
    case entityName === "TAG": {
      const lastTagKey = getLastIntKey(tempTagStore);

      if (lastTagKey) {
        const keyPlusOne = lastTagKey + 1;
        tempTagStore[keyId] = { ...payload };

        return payload;
      }

      const notFoundTag: IError = {
        message: `Could not find an existing key`,
        status: 500,
      };

      return notFoundTag;
    }
    case entityName === "USER": {
      const lastUserKey = getLastIntKey(tempUserStore);

      if (lastUserKey) {
        const keyPlusOne = lastUserKey + 1;
        tempUserStore[keyId] = { ...payload };

        return payload;
      }

      const notFoundUser: IError = {
        message: `Could not find an existing key`,
        status: 500,
      };

      return notFoundUser;
    }
    default:
      const notFound: IError = {
        message: `${entityName} entity not found for key ${keyId}`,
        status: 404,
      };

      return notFound;
  }
};

// update an existing entity
