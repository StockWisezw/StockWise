import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';

export const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

class AppwriteQueryBuilder {
  table: string;
  queries: string[] = [];
  isInsert = false;
  isUpdate = false;
  isDelete = false;
  payload: any = null;

  constructor(table: string) {
    this.table = table;
  }
  select(fields?: string | any) {
     return this;
  }
  eq(col: string, val: any) {
     this.queries.push(Query.equal(col, val));
     return this;
  }
  order(col: string, opts?: { ascending?: boolean }) {
     if (opts?.ascending === false) {
       this.queries.push(Query.orderDesc(col));
     } else {
       this.queries.push(Query.orderAsc(col));
     }
     return this;
  }
  limit(n: number) {
     this.queries.push(Query.limit(n));
     return this;
  }
  insert(data: any | any[]) {
     this.isInsert = true;
     this.payload = Array.isArray(data) ? data : [data];
     return this;
  }
  upsert(data: any | any[]) {
     this.isInsert = true;
     this.payload = Array.isArray(data) ? data : [data];
     return this;
  }
  update(data: any) {
     this.isUpdate = true;
     this.payload = data;
     return this;
  }
  delete() {
     this.isDelete = true;
     return this;
  }
  
  async maybeSingle() {
     const res = await this.executeSelect();
     return { data: res[0] || null, error: null };
  }
  async single() {
     const res = await this.executeSelect();
     if (!res[0]) return { data: null, error: new Error("Row not found") };
     return { data: res[0], error: null };
  }
  
  async executeSelect() {
     const res = await databases.listDocuments(DATABASE_ID, this.table, this.queries);
     return res.documents.map(d => ({ ...d, id: d.$id }));
  }

  async executeInsert() {
      const results = [];
      for (const item of this.payload) {
         if (item.id) delete item.id;
         const res = await databases.createDocument(DATABASE_ID, this.table, ID.unique(), item);
         results.push({ ...res, id: res.$id });
      }
      return results;
  }

  async executeUpdate() {
      const docs = await this.executeSelect();
      const results = [];
      for (const doc of docs) {
          const res = await databases.updateDocument(DATABASE_ID, this.table, doc.id, this.payload);
          results.push({ ...res, id: res.$id });
      }
      return results;
  }

  async executeDelete() {
      const docs = await this.executeSelect();
      for (const doc of docs) {
          await databases.deleteDocument(DATABASE_ID, this.table, doc.id);
      }
      return [];
  }

  then(resolve: any, reject: any) {
     this.execute().then(resolve).catch(reject);
  }

  async execute() {
      try {
         if (this.isInsert) {
             const data = await this.executeInsert();
             return { data, error: null };
         } else if (this.isUpdate) {
             const data = await this.executeUpdate();
             return { data, error: null };
         } else if (this.isDelete) {
             await this.executeDelete();
             return { data: null, error: null };
         } else {
             const data = await this.executeSelect();
             return { data, count: data.length, error: null };
         }
      } catch (error) {
         return { data: null, error };
      }
  }
}

export const supabase = {
  auth: {
    getUser: async () => {
      try {
        const user = await account.get();
        return { data: { user: { id: user.$id, email: user.email } }, error: null };
      } catch (error) {
        return { data: { user: null }, error };
      }
    },
    getSession: async () => {
      try {
        const session = await account.getSession('current');
        return { data: { session }, error: null };
      } catch (error) {
        return { data: { session: null }, error };
      }
    },
    signOut: async () => {
      try {
        await account.deleteSession('current');
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    onAuthStateChange: (cb: any) => {
       const unsubscribe = () => {};
       return { data: { subscription: { unsubscribe } } };
    }
  },
  from: (table: string) => new AppwriteQueryBuilder(table),
  channel: (name: string) => {
     return {
         on: () => ({ subscribe: () => {} }),
         subscribe: () => {}
     }
  },
  removeChannel: () => {}
};
