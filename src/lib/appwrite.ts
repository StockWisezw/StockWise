import { Client, Account, Databases, Storage, Query, ID } from 'appwrite';

const appwriteEndpoint = import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const appwriteProjectId = import.meta.env.VITE_APPWRITE_PROJECT_ID || '';
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID || 'default';
export const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'tareza-uploads';

export const client = new Client().setEndpoint(appwriteEndpoint).setProject(appwriteProjectId);
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

// All allowed keys mapped to SQL columns for high-performance payload pruning
const ALLOWED_KEYS: Record<string, string[]> = {
  businesses: ['name', 'tax_number', 'email', 'phone', 'currency', 'subscription_plan', 'subscription_status', 'subscription_end_date', 'max_users', 'max_branches', 'created_at', 'updated_at'],
  branches: ['business_id', 'name', 'address', 'phone', 'type', 'is_active', 'created_at', 'updated_at'],
  profiles: ['first_name', 'last_name', 'phone', 'email', 'created_at', 'updated_at'],
  roles: ['business_id', 'name', 'description', 'created_at', 'updated_at'],
  role_permissions: ['role_id', 'permissions', 'created_at'],
  business_users: ['business_id', 'user_id', 'branch_id', 'role_id', 'is_active', 'created_at', 'updated_at'],
  categories: ['business_id', 'name', 'parent_id', 'created_at'],
  products: ['business_id', 'category_id', 'name', 'description', 'sku', 'barcode', 'retail_price', 'wholesale_price', 'cost_price', 'price', 'tax_class', 'tax_rate_id', 'is_active', 'created_at'],
  inventory: ['business_id', 'branch_id', 'product_id', 'quantity', 'reorder_level', 'created_at', 'updated_at'],
  customers: ['business_id', 'name', 'email', 'phone', 'address', 'vat_number', 'customer_type', 'balance', 'credit_limit', 'created_at'],
  suppliers: ['business_id', 'name', 'contact_person', 'email', 'phone', 'address', 'created_at'],
  sales: ['business_id', 'branch_id', 'user_id', 'customer_id', 'customerId', 'customerName', 'receiptNumber', 'items', 'payments', 'subtotal', 'vat_total', 'vatTotal', 'discount_total', 'discountTotal', 'total', 'total_amount', 'total_tax_amount', 'payment_method', 'status', 'timestamp', 'created_at'],
  sale_items: ['sale_id', 'product_id', 'quantity', 'price', 'unit_price', 'line_total', 'vat_amount'],
  expense_categories: ['business_id', 'name', 'description', 'created_at'],
  cash_drawer_logs: ['business_id', 'branch_id', 'amount', 'type', 'transaction_type', 'notes', 'created_at'],
  tax_rates: ['business_id', 'name', 'rate', 'is_active'],
  purchase_orders: ['business_id', 'supplier_id', 'status', 'total_amount', 'created_at'],
  stocktakes_advanced: ['business_id', 'branch_id', 'status', 'created_at'],
  inventory_transfers: ['business_id', 'from_branch_id', 'to_branch_id', 'status', 'created_at'],
  stock_movements: ['product_id', 'branch_id', 'quantity', 'type', 'created_at'],
  subscriptions: ['business_id', 'plan_name', 'status', 'start_date', 'end_date', 'created_at']
};

const ATTR_TYPES: Record<string, Record<string, 'string' | 'integer' | 'float' | 'boolean' | 'datetime'>> = {
  businesses: {
    name: 'string', tax_number: 'string', email: 'string', phone: 'string', currency: 'string',
    subscription_plan: 'string', subscription_status: 'string', subscription_end_date: 'datetime',
    max_users: 'integer', max_branches: 'integer', created_at: 'datetime', updated_at: 'datetime'
  },
  branches: {
    business_id: 'string', name: 'string', address: 'string', phone: 'string', type: 'string',
    is_active: 'boolean', created_at: 'datetime', updated_at: 'datetime'
  },
  profiles: {
    first_name: 'string', last_name: 'string', phone: 'string', email: 'string',
    created_at: 'datetime', updated_at: 'datetime'
  },
  roles: {
    business_id: 'string', name: 'string', description: 'string', created_at: 'datetime', updated_at: 'datetime'
  },
  role_permissions: {
    role_id: 'string', permissions: 'string', created_at: 'datetime'
  },
  business_users: {
    business_id: 'string', user_id: 'string', branch_id: 'string', role_id: 'string',
    is_active: 'boolean', created_at: 'datetime', updated_at: 'datetime'
  },
  categories: {
    business_id: 'string', name: 'string', parent_id: 'string', created_at: 'datetime'
  },
  products: {
    business_id: 'string', category_id: 'string', name: 'string', description: 'string',
    sku: 'string', barcode: 'string', retail_price: 'float', wholesale_price: 'float',
    cost_price: 'float', price: 'float', tax_class: 'string', tax_rate_id: 'string',
    is_active: 'boolean', created_at: 'datetime'
  },
  inventory: {
    business_id: 'string', branch_id: 'string', product_id: 'string', quantity: 'float',
    reorder_level: 'float', created_at: 'datetime', updated_at: 'datetime'
  },
  customers: {
    business_id: 'string', name: 'string', email: 'string', phone: 'string', address: 'string',
    vat_number: 'string', customer_type: 'string', balance: 'float', credit_limit: 'float', created_at: 'datetime'
  },
  suppliers: {
    business_id: 'string', name: 'string', contact_person: 'string', email: 'string',
    phone: 'string', address: 'string', created_at: 'datetime'
  },
  sales: {
    business_id: 'string', branch_id: 'string', user_id: 'string', customer_id: 'string',
    customerId: 'string', customerName: 'string', receiptNumber: 'string', items: 'string',
    payments: 'string', subtotal: 'float', vat_total: 'float', vatTotal: 'float',
    discount_total: 'float', discountTotal: 'float', total: 'float', total_amount: 'float',
    total_tax_amount: 'float', payment_method: 'string', status: 'string', timestamp: 'string', created_at: 'datetime'
  },
  sale_items: {
    sale_id: 'string', product_id: 'string', quantity: 'integer', price: 'float',
    unit_price: 'float', line_total: 'float', vat_amount: 'float'
  },
  expense_categories: {
    business_id: 'string', name: 'string', description: 'string', created_at: 'datetime'
  },
  cash_drawer_logs: {
    business_id: 'string', branch_id: 'string', amount: 'float', type: 'string',
    transaction_type: 'string', notes: 'string', created_at: 'datetime'
  },
  tax_rates: {
    business_id: 'string', name: 'string', rate: 'float', is_active: 'boolean'
  },
  purchase_orders: {
    business_id: 'string', supplier_id: 'string', status: 'string', total_amount: 'float', created_at: 'datetime'
  },
  stocktakes_advanced: {
    business_id: 'string', branch_id: 'string', status: 'string', created_at: 'datetime'
  },
  inventory_transfers: {
    business_id: 'string', from_branch_id: 'string', to_branch_id: 'string', status: 'string', created_at: 'datetime'
  },
  stock_movements: {
    product_id: 'string', branch_id: 'string', quantity: 'integer', type: 'string', created_at: 'datetime'
  },
  subscriptions: {
    business_id: 'string', plan_name: 'string', status: 'string', start_date: 'datetime', end_date: 'datetime', created_at: 'datetime'
  }
};

function normalizeInput(item: any, table: string): any {
  const allowed = ALLOWED_KEYS[table];
  if (!allowed) return item;

  const copy: any = {};
  const types = ATTR_TYPES[table] || {};

  for (const key of allowed) {
    let val = item[key];
    if (val === undefined || val === null) {
      continue;
    }

    const type = types[key];

    // Handle string serialization for nested lists/objects
    if (type === 'string' && (key === 'items' || key === 'payments' || key === 'permissions') && typeof val !== 'string') {
      try {
        val = JSON.stringify(val);
      } catch (e) {
        val = '';
      }
    }

    if (type === 'integer') {
      val = parseInt(val, 10);
      if (isNaN(val)) val = 0;
    } else if (type === 'float') {
      val = parseFloat(val);
      if (isNaN(val)) val = 0;
    } else if (type === 'boolean') {
      val = Boolean(val);
    } else if (type === 'datetime') {
      if (val) {
        try {
          val = new Date(val).toISOString();
        } catch (e) {
          val = new Date().toISOString();
        }
      } else {
        val = new Date().toISOString();
      }
    } else if (type === 'string') {
      val = String(val);
      let maxLen = 255;
      if (key === 'address' || key === 'description' || key === 'notes') {
        maxLen = 1000;
      } else if (key === 'items' || key === 'payments' || key === 'permissions') {
        maxLen = 3000;
      }
      if (val.length > maxLen) {
        val = val.substring(0, maxLen);
      }
    }

    copy[key] = val;
  }

  return copy;
}

function normalizeOutput(doc: any, table: string): any {
  if (!doc) return doc;
  const copy = { ...doc, id: doc.$id };

  if (table === 'sales') {
    if (typeof copy.items === 'string') {
      try { copy.items = JSON.parse(copy.items); } catch (e) {}
    }
    if (typeof copy.payments === 'string') {
      try { copy.payments = JSON.parse(copy.payments); } catch (e) {}
    }
  } else if (table === 'role_permissions') {
    if (typeof copy.permissions === 'string') {
      try { copy.permissions = JSON.parse(copy.permissions); } catch (e) {}
    }
  }

  return copy;
}

class AppwriteQueryBuilder implements PromiseLike<{ data: any[] | null; count: number | null; error: any }> {
  table: string;
  queries: string[] = [];
  filters: { col: string; val: any }[] = [];
  isInsert = false;
  isUpdate = false;
  isDelete = false;
  payload: any = null;

  constructor(table: string) {
    this.table = table;
  }

  select(fields?: string | any, options?: any) {
    return this;
  }

  eq(col: string, val: any) {
    const targetCol = col === 'id' ? '$id' : col;
    this.filters.push({ col, val });
    this.queries.push(Query.equal(targetCol, val));
    return this;
  }

  gte(col: string, val: any) {
    const targetCol = col === 'id' ? '$id' : col;
    this.queries.push(Query.greaterThanEqual(targetCol, val));
    return this;
  }

  lte(col: string, val: any) {
    const targetCol = col === 'id' ? '$id' : col;
    this.queries.push(Query.lessThanEqual(targetCol, val));
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

  async getTargetDocIds() {
    const idFilter = this.filters.find(f => f.col === 'id' || f.col === '$id');
    if (idFilter) {
      return [idFilter.val];
    }
    try {
      const res = await databases.listDocuments(DATABASE_ID, this.table, this.queries);
      return res.documents.map(d => d.$id);
    } catch (e) {
      console.error(`Error resolving IDs on ${this.table}:`, e);
      return [];
    }
  }

  async maybeSingle() {
    const res = await this.executeSelect();
    return { data: res[0] || null, error: null };
  }

  async single() {
    const res = await this.executeSelect();
    if (!res[0]) return { data: null, error: new Error('Document not found') };
    return { data: res[0], error: null };
  }

  async executeSelect() {
    const res = await databases.listDocuments(DATABASE_ID, this.table, this.queries);
    return res.documents.map(d => normalizeOutput(d, this.table));
  }

  async executeInsert() {
    const results = [];
    for (const rawItem of this.payload) {
      const docId = rawItem.id || ID.unique();
      const item = normalizeInput(rawItem, this.table);
      try {
        const res = await databases.createDocument(DATABASE_ID, this.table, docId, item);
        results.push(normalizeOutput(res, this.table));
      } catch (err: any) {
        if (err.code === 409) {
          const res = await databases.updateDocument(DATABASE_ID, this.table, docId, item);
          results.push(normalizeOutput(res, this.table));
        } else {
          throw err;
        }
      }
    }
    return results;
  }

  async executeUpdate() {
    const ids = await this.getTargetDocIds();
    const results = [];
    const item = normalizeInput(this.payload, this.table);
    for (const id of ids) {
      const res = await databases.updateDocument(DATABASE_ID, this.table, id, item);
      results.push(normalizeOutput(res, this.table));
    }
    return results;
  }

  async executeDelete() {
    const ids = await this.getTargetDocIds();
    for (const id of ids) {
      await databases.deleteDocument(DATABASE_ID, this.table, id);
    }
    return [];
  }

  then<TResult1 = { data: any[] | null; count: number | null; error: any }, TResult2 = never>(
    onfulfilled?: ((value: { data: any[] | null; count: number | null; error: any }) => TResult1 | PromiseLike<TResult1>) | undefined | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null
  ): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  async execute() {
    try {
      if (this.isInsert) {
        const data = await this.executeInsert();
        return { data, count: data.length, error: null };
      } else if (this.isUpdate) {
        const data = await this.executeUpdate();
        return { data, count: data.length, error: null };
      } else if (this.isDelete) {
        await this.executeDelete();
        return { data: null, count: 0, error: null };
      } else {
        const data = await this.executeSelect();
        return { data, count: data.length, error: null };
      }
    } catch (error) {
      console.error(`Appwrite query failed on ${this.table}:`, error);
      return { data: null, count: null, error };
    }
  }
}

export const appwrite = {
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
    signUp: async ({ email, password }: any) => {
      try {
        const user = await account.create(ID.unique(), email, password);
        try {
          await account.createEmailPasswordSession(email, password);
        } catch (e) {
          console.warn('Auto sign-in during signup failed:', e);
        }
        return { data: { user: { id: user.$id, email: user.email } }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signInWithPassword: async ({ email, password }: any) => {
      try {
        const session = await account.createEmailPasswordSession(email, password);
        const user = await account.get();
        return { data: { user: { id: user.$id, email: user.email }, session }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    signInWithOAuth: async ({ provider }: any) => {
      try {
        await account.createOAuth2Session(provider, window.location.origin, window.location.origin);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    signInAnonymously: async () => {
      try {
        const session = await account.createAnonymousSession();
        return { data: { session }, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    sendMagicLink: async (email: string) => {
      try {
        const token = await account.createMagicURLToken(ID.unique(), email, window.location.origin);
        return { data: token, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    completeMagicLinkSession: async (userId: string, secret: string) => {
      try {
        const session = await account.createSession(userId, secret);
        return { data: { session }, error: null };
      } catch (error) {
        return { data: null, error };
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
  storage: {
    uploadFile: async (file: File, bucketId: string = BUCKET_ID) => {
      try {
        const res = await storage.createFile(bucketId, ID.unique(), file);
        return { data: res, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    getFileView: (fileId: string, bucketId: string = BUCKET_ID) => {
      try {
        const url = storage.getFileView(bucketId, fileId);
        return url;
      } catch (error) {
        console.error('Error getting file view URL:', error);
        return '';
      }
    },
    getFileDownload: (fileId: string, bucketId: string = BUCKET_ID) => {
      try {
        const url = storage.getFileDownload(bucketId, fileId);
        return url;
      } catch (error) {
        console.error('Error getting file download URL:', error);
        return '';
      }
    },
    deleteFile: async (fileId: string, bucketId: string = BUCKET_ID) => {
      try {
        await storage.deleteFile(bucketId, fileId);
        return { error: null };
      } catch (error) {
        return { error };
      }
    },
    listFiles: async (queries: string[] = [], bucketId: string = BUCKET_ID) => {
      try {
        const list = await storage.listFiles(bucketId, queries);
        return { data: list.files, error: null };
      } catch (error) {
        return { data: null, error };
      }
    }
  },
  channel: (name: string) => {
    return {
      on: (event: string, filter: any, callback: any) => ({
        subscribe: () => {}
      }),
      subscribe: () => {}
    };
  },
  removeChannel: (channel: any) => {}
};

export type { AppwriteQueryBuilder };
