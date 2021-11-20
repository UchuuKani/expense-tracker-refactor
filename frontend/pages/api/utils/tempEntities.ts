import { ITransaction, ITag, IUser } from "../../../src/types";

interface IError {
  message?: string;
  status?: number;
}

interface TempStore {
  [id: PropertyKey]: ITransaction | ITag | IUser;
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
  user_id: testUserOne?.id || 1,
  description: "Stuff",
  amount: 5000,
  transaction_date: new Date("2021-05-13"),
  tags: [{ ...testTagOne }],
};

export const tempTransactionStore: TempStore = {
  1: { ...testTransactionOne },
};

export const tempTagStore: TempStore = {
  1: {
    ...testTagOne,
  },
};

export const tempUserStore: TempStore = {
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

export const getKeyInEntity = (entityStore: TempStore, key: string) => {
  return entityStore?.[key];
};

// POST a new entity
export const addToEntity = (entityName: string, payload: any): IError | any => {
  if (entityName === "TRANSACTION") {
    let lastTransactionKey = getLastIntKey(tempTransactionStore);

    if (lastTransactionKey) {
      const keyPlusOne = lastTransactionKey + 1;
      tempTransactionStore[keyPlusOne] = { ...payload };
      console.log("ehem", tempTransactionStore);
      return { ...payload, id: keyPlusOne };
    }

    const notFoundTransaction: IError = {
      message: `Store not initialized`,
      status: 500,
    };

    return notFoundTransaction;
  } else if (entityName === "TAG") {
    const lastTagKey = getLastIntKey(tempTagStore);

    if (lastTagKey) {
      const tagKeyPlusOne = lastTagKey + 1;
      tempTagStore[tagKeyPlusOne] = { ...payload };

      return payload;
    }

    const notFoundTag: IError = {
      message: `Could not find an existing key`,
      status: 500,
    };

    return notFoundTag;
  } else if (entityName === "USER") {
    const lastUserKey = getLastIntKey(tempUserStore);

    if (lastUserKey) {
      const keyPlusOne = lastUserKey + 1;
      tempUserStore[keyPlusOne] = { ...payload };

      return payload;
    }

    const notFoundUser: IError = {
      message: `Could not find an existing key`,
      status: 500,
    };

    return notFoundUser;
  }

  const notFound: IError = {
    message: `${entityName} entity not found`,
    status: 404,
  };

  return notFound;
};

export const findOrCreateTags = () => {};

// update an existing entity
