import { Client, Databases, Storage, Users, ID } from 'node-appwrite';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '../.env') });

const endpoint = process.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.VITE_APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY; // Requires an API key with DB management scopes
const databaseId = process.env.VITE_APPWRITE_DATABASE_ID || 'default';

if (!projectId || !apiKey) {
    console.error('Missing APPWRITE_PROJECT_ID or APPWRITE_API_KEY in .env');
    console.info('To create the schema, run:');
    console.info('APPWRITE_API_KEY=your_api_key node scripts/setup-appwrite.js');
    process.exit(1);
}

const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey);

const databases = new Databases(client);

const schema = [
    {
        name: 'businesses',
        attributes: [
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'roles',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'description', type: 'string', required: false, size: 1000 }
        ]
    },
    {
        name: 'branches',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'type', type: 'string', required: false, size: 255 }
        ]
    },
    {
        name: 'business_users',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'user_id', type: 'string', required: true, size: 255 },
            { key: 'role_id', type: 'string', required: false, size: 255 }
        ]
    },
    {
        name: 'categories',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 }
        ]
    },
    {
        name: 'subscriptions',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'plan_name', type: 'string', required: true, size: 255 },
            { key: 'status', type: 'string', required: true, size: 255 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'profiles',
        attributes: [
            { key: 'first_name', type: 'string', required: false, size: 255 },
            { key: 'last_name', type: 'string', required: false, size: 255 }
        ]
    },
    {
        name: 'sales',
        attributes: [
            { key: 'total_amount', type: 'float', required: false },
            { key: 'total_tax_amount', type: 'float', required: false },
            { key: 'created_at', type: 'datetime', required: false },
            { key: 'customerId', type: 'string', required: false, size: 255 },
            { key: 'business_id', type: 'string', required: false, size: 255 },
            { key: 'branch_id', type: 'string', required: false, size: 255 }
        ]
    },
    {
        name: 'sale_items',
        attributes: [
            { key: 'sale_id', type: 'string', required: true, size: 255 },
            { key: 'product_id', type: 'string', required: true, size: 255 },
            { key: 'quantity', type: 'integer', required: true },
            { key: 'price', type: 'float', required: true }
        ]
    },
    {
        name: 'customers',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'email', type: 'string', required: false, size: 255 },
            { key: 'phone', type: 'string', required: false, size: 255 },
            { key: 'balance', type: 'float', required: false },
            { key: 'credit_limit', type: 'float', required: false }
        ]
    },
    {
        name: 'products',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'category_id', type: 'string', required: false, size: 255 },
            { key: 'price', type: 'float', required: true },
            { key: 'cost_price', type: 'float', required: false },
            { key: 'sku', type: 'string', required: false, size: 255 },
            { key: 'barcode', type: 'string', required: false, size: 255 },
            { key: 'is_active', type: 'boolean', required: false }
        ]
    },
    {
        name: 'cash_drawer_logs',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'branch_id', type: 'string', required: true, size: 255 },
            { key: 'amount', type: 'float', required: true },
            { key: 'type', type: 'string', required: true, size: 255 },
            { key: 'notes', type: 'string', required: false, size: 1000 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'inventory',
        attributes: [
            { key: 'product_id', type: 'string', required: true, size: 255 },
            { key: 'branch_id', type: 'string', required: true, size: 255 },
            { key: 'quantity', type: 'integer', required: true }
        ]
    },
    {
        name: 'tax_rates',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'rate', type: 'float', required: true },
            { key: 'is_active', type: 'boolean', required: false }
        ]
    },
    {
        name: 'expense_categories',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 }
        ]
    },
    {
        name: 'suppliers',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'name', type: 'string', required: true, size: 255 },
            { key: 'contact_email', type: 'string', required: false, size: 255 },
            { key: 'contact_phone', type: 'string', required: false, size: 255 }
        ]
    },
    {
        name: 'purchase_orders',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'supplier_id', type: 'string', required: true, size: 255 },
            { key: 'status', type: 'string', required: true, size: 255 },
            { key: 'total_amount', type: 'float', required: false },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'stocktakes_advanced',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'branch_id', type: 'string', required: true, size: 255 },
            { key: 'status', type: 'string', required: true, size: 255 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'inventory_transfers',
        attributes: [
            { key: 'business_id', type: 'string', required: true, size: 255 },
            { key: 'from_branch_id', type: 'string', required: true, size: 255 },
            { key: 'to_branch_id', type: 'string', required: true, size: 255 },
            { key: 'status', type: 'string', required: true, size: 255 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    },
    {
        name: 'stock_movements',
        attributes: [
            { key: 'product_id', type: 'string', required: true, size: 255 },
            { key: 'branch_id', type: 'string', required: true, size: 255 },
            { key: 'quantity', type: 'integer', required: true },
            { key: 'type', type: 'string', required: true, size: 255 },
            { key: 'created_at', type: 'datetime', required: false }
        ]
    }
];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function createSchema() {
    try {
        console.log(`Checking if database '${databaseId}' exists...`);
        try {
            await databases.get(databaseId);
            console.log(`Database '${databaseId}' found.`);
        } catch (e) {
            if (e.code === 404) {
                console.log(`Creating database '${databaseId}'...`);
                await databases.create(databaseId, databaseId);
            } else {
                throw e;
            }
        }

        console.log('Setting up collections and attributes...');

        for (const collection of schema) {
            // Because Appwrite requires a custom ID to be essentially the same as the name if we want to call it by name easily
            let collId = collection.name;
            try {
                await databases.getCollection(databaseId, collId);
                console.log(`Collection '${collId}' already exists.`);
            } catch (e) {
                if (e.code === 404) {
                    console.log(`Creating collection '${collId}'...`);
                    await databases.createCollection(
                        databaseId,
                        collId,
                        collId
                    );
                } else {
                    console.error(`Status retrieving collection ${collId}:`, e.message);
                }
            }

            console.log(`Creating attributes for '${collId}'...`);
            for (const attr of collection.attributes) {
                try {
                    switch (attr.type) {
                        case 'string':
                            await databases.createStringAttribute(databaseId, collId, attr.key, attr.size || 255, attr.required);
                            break;
                        case 'integer':
                            await databases.createIntegerAttribute(databaseId, collId, attr.key, attr.required);
                            break;
                        case 'float':
                            await databases.createFloatAttribute(databaseId, collId, attr.key, attr.required);
                            break;
                        case 'boolean':
                            await databases.createBooleanAttribute(databaseId, collId, attr.key, attr.required);
                            break;
                        case 'datetime':
                            await databases.createDatetimeAttribute(databaseId, collId, attr.key, attr.required);
                            break;
                    }
                    console.log(`   + Attribute '${attr.key}' created or requested.`);
                    // Appwrite limits attribute creation rate concurrently, sleep slightly
                    await sleep(200);
                } catch (e) {
                    if (e.code === 409) {
                        // Already exists
                        console.log(`   - Attribute '${attr.key}' already exists.`);
                    } else {
                        console.error(`   ! Failed creating '${attr.key}':`, e.message);
                    }
                }
            }
            
            console.log(`Waiting for attributes to be processed on '${collId}'...`);
            await sleep(2000); // Give the Appwrite queue time to build indexes/attributes
        }

        console.log('Database setup complete!');
    } catch (e) {
        console.error('Migration failed:', e);
    }
}

createSchema();
