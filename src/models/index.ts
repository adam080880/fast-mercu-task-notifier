import {v6 as uuidV6} from 'uuid';
import {readFileSync, writeFileSync} from 'fs';

interface DataID {
  id: string;
}

class Model<T extends DataID> {
  private filePath: string = '';
  private condition: ModelConditioning<T> = {};
  private data: Array<T> = [];
  private saveTimeout: any = null;

  constructor(fileName: string) {
    try {
      // read from folder database
      this.filePath = `./src/databases/${fileName}.json`;

      const readData = readFileSync(this.filePath, 'utf-8');
      this.data = JSON.parse(readData);

      return this;
    } catch (error) {
      throw Error(`File not found ${this.filePath}`);
    }
  }

  public on = (condition: ModelConditioning<T>) => {
    this.condition = condition;

    return this;
  };

  public get = (): Array<T> => {
    if (Object.keys(this.condition).length > 0) {
      const getData = this.processFilter(this.data, this.condition);

      return getData;
    }

    return this.data;
  }

  public getOne = (): T | undefined => {
    if (Object.keys(this.condition).length > 0) {
      const getData = this.processFilter(this.data, this.condition);

      return getData[0];
    }


    return this.data[0];
  }

  public getAll = (): Array<T> => {
    return this.data;
  }

  public findOne = (id: string): T | undefined => {
    return this.data.find((d) => d.id === id);
  }

  public create = (payload: Omit<T, 'id'>): T => {
    const newData = {...payload, id: this.generateId()} as T;
    this.data.push(newData);

    this.rewriteDataToFile(this.data);

    return newData;
  }

  protected generateId = (): string => {
    return uuidV6();
  }

  private processFilter = (data: Array<T>, condition: ModelConditioning<T>) => {
    let getData = [...data];

    for (const conditionKey of Object.keys(condition)) {
      const selectCondition = this.condition[conditionKey as keyof T];

      getData = getData.filter((data) => {
        switch (selectCondition?.method) {
          case 'eq':
            return data[conditionKey as keyof T] == selectCondition.value;
          case 'gt':
            return data[conditionKey as keyof T] > selectCondition.value;
          case 'lt':
            return data[conditionKey as keyof T] < selectCondition.value;
          case 'gte':
            return data[conditionKey as keyof T] >= selectCondition.value;
          case 'lte':
            return data[conditionKey as keyof T] <= selectCondition.value;
          case 'neq':
            return data[conditionKey as keyof T] != selectCondition.value;
          default:
            return true;
        }
      });
    }

    return getData;
  };

  private rewriteDataToFile = (newData: T[]) => {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    const filePath = this.filePath;

    // save to json delay 5s
    this.saveTimeout = setTimeout(() => {
      writeFileSync(filePath, JSON.stringify(newData));
    }, 5000);
  }
};

export type ModelConditioning<T> = Partial<{
  [key in keyof T]: {
    /**
     * eq => equal
     * gt => greater than
     * lt => less than
     * gte => greater than equal
     * lte => less than equal
     * neq => not equal
     */
    method: 'eq' | 'gt' | 'lt' | 'gte' | 'lte' | 'neq',
    value: any,
  }
}>;

export default Model;
