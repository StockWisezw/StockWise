import { supabase } from "./supabase";

const DEMO_EMAIL = "demo@tareza.co.zw";
// Hardcoded UUIDv4s for strict relational database constraint integrity
const DEMO_BUSINESS_ID = "2b88390b-6dd2-4160-b08e-8a033c46b5dc";
const DEMO_BRANCH_HARARE_CBD = "3c88390b-6dd2-4160-b08e-8a033c46b5dc";
const DEMO_BRANCH_BULAWAY = "4d88390b-6dd2-4160-b08e-8a033c46b5dc";

export async function runDatabaseSeeder() {
  console.log("[Seeder] Starting Supabase ERP database seeding...");

  const timestampISO = new Date().toISOString();

  // Helper helper to upsert table data safely
  async function seedTableRecord(table: string, primaryId: string, payload: any) {
    try {
      const { error } = await supabase.from(table).upsert({ id: primaryId, ...payload });
      if (error) {
        console.warn(`[Seeder] Non-blocking warning seeding table "${table}" (ID: ${primaryId}):`, error.message);
      } else {
        console.log(`[Seeder] Seeded table "${table}" (ID: ${primaryId}) successfully.`);
      }
    } catch (err: any) {
      console.warn(`[Seeder] Error seeding table "${table}":`, err.message || String(err));
    }
  }

  // 1. Seed Businesses
  await seedTableRecord("businesses", DEMO_BUSINESS_ID, {
    name: "Tareza Retail & Wholesale Zimbabwe",
    tax_number: "BP801938222-Z-ZIMRA",
    email: DEMO_EMAIL,
    phone: "+263 24 2700123",
    currency: "USD",
    subscription_plan: "enterprise_pro",
    subscription_status: "ACTIVE",
    subscription_end_date: "2099-12-31T23:59:59.000Z",
    max_users: 999999,
    max_branches: 100000,
    created_at: timestampISO,
    updated_at: timestampISO
  });

  // 2. Seed Branches (Retail and Wholesale)
  await seedTableRecord("branches", DEMO_BRANCH_HARARE_CBD, {
    business_id: DEMO_BUSINESS_ID,
    name: "Harare CBD Flagship",
    address: "77 Jason Moyo Ave, Harare Central",
    phone: "+263 24 2700123",
    type: "retail",
    is_active: true,
    created_at: timestampISO
  });

  await seedTableRecord("branches", DEMO_BRANCH_BULAWAY, {
    business_id: DEMO_BUSINESS_ID,
    name: "Bulawayo Wholesale Hub",
    address: "104 Fife Street, Bulawayo Industrial",
    phone: "+263 9 881234",
    type: "wholesale",
    is_active: true,
    created_at: timestampISO
  });

  // 3. Seed Categories
  const DEMO_CAT_GROCERIES = "5e88390b-6dd2-4160-b08e-8a033c46b5dc";
  const DEMO_CAT_HARDWARE = "6f88390b-6dd2-4160-b08e-8a033c46b5dc";
  const DEMO_CAT_ELECTRONICS = "7a88390b-6dd2-4160-b08e-8a033c46b5dc";

  await seedTableRecord("categories", DEMO_CAT_GROCERIES, {
    business_id: DEMO_BUSINESS_ID,
    name: "Groceries & Essentials",
    created_at: timestampISO
  });

  await seedTableRecord("categories", DEMO_CAT_HARDWARE, {
    business_id: DEMO_BUSINESS_ID,
    name: "Building & Hardware",
    created_at: timestampISO
  });

  await seedTableRecord("categories", DEMO_CAT_ELECTRONICS, {
    business_id: DEMO_BUSINESS_ID,
    name: "Electronics & Tech",
    created_at: timestampISO
  });

  // 4. Seed Products
  const DEMO_PROD_CO_OIL = "8b88390b-6dd2-4160-b08e-8a033c46b5dc";
  const DEMO_PROD_CA_FLOUR = "9c88390b-6dd2-4160-b08e-8a033c46b5dc";
  const DEMO_PROD_CEMENT = "0a88390b-6dd2-4160-b08e-8a033c46b5dc";
  const DEMO_PROD_SOLAR = "0b88390b-6dd2-4160-b08e-8a033c46b5dc";

  await seedTableRecord("products", DEMO_PROD_CO_OIL, {
    business_id: DEMO_BUSINESS_ID,
    category_id: DEMO_CAT_GROCERIES,
    name: "Pure Drop Cooking Oil - 2L",
    description: "Locally manufactured premium pure vegetable cooking oil",
    sku: "SKU-PD-COIL-2L",
    barcode: "6001234567891",
    retail_price: 3.50,
    wholesale_price: 3.10,
    cost_price: 2.50,
    price: 3.50,
    tax_class: "standard",
    is_active: true,
    created_at: timestampISO
  });

  await seedTableRecord("products", DEMO_PROD_CA_FLOUR, {
    business_id: DEMO_BUSINESS_ID,
    category_id: DEMO_CAT_GROCERIES,
    name: "Gloria Cake Flour - 2kg",
    description: "Premium cake flour for household and bakery use",
    sku: "SKU-GL-CFLR-2K",
    barcode: "6001234567892",
    retail_price: 2.10,
    wholesale_price: 1.85,
    cost_price: 1.45,
    price: 2.10,
    tax_class: "standard",
    is_active: true,
    created_at: timestampISO
  });

  await seedTableRecord("products", DEMO_PROD_CEMENT, {
    business_id: DEMO_BUSINESS_ID,
    category_id: DEMO_CAT_HARDWARE,
    name: "PPC Cement PC15 - 50kg Bag",
    description: "Premium Portland Cement for construction works",
    sku: "SKU-PPC-CEMENT-50K",
    barcode: "6001234567893",
    retail_price: 10.50,
    wholesale_price: 9.80,
    cost_price: 8.00,
    price: 10.50,
    tax_class: "standard",
    is_active: true,
    created_at: timestampISO
  });

  await seedTableRecord("products", DEMO_PROD_SOLAR, {
    business_id: DEMO_BUSINESS_ID,
    category_id: DEMO_CAT_ELECTRONICS,
    name: "Tareza 550W Mono Solar Panel",
    description: "High-efficiency monocrystalline solar panel",
    sku: "SKU-TZ-SP-550W",
    barcode: "6001234567894",
    retail_price: 115.00,
    wholesale_price: 105.00,
    cost_price: 85.00,
    price: 115.00,
    tax_class: "standard",
    is_active: true,
    created_at: timestampISO
  });

  // 5. Seed Accounts (Chart of Accounts)
  const defaultAccounts = [
    { code: '1000', name: 'Main POS Cash Till', type: 'Asset', balance: 1000 },
    { code: '1100', name: 'Accounts Receivable', type: 'Asset', balance: 0 },
    { code: '1200', name: 'Merchandise Inventory Account', type: 'Asset', balance: 5000 },
    { code: '2000', name: 'Accounts Payable', type: 'Liability', balance: 0 },
    { code: '3000', name: 'Shareholders Retained Equity', type: 'Equity', balance: 6000 },
    { code: '4000', name: 'Sales Revenue Account', type: 'Revenue', balance: 0 },
    { code: '5000', name: 'Cost of Goods Sold (COGS)', type: 'Expense', balance: 0 },
    { code: '6000', name: 'Operating and Cash Expenses', type: 'Expense', balance: 0 }
  ];

  for (const acct of defaultAccounts) {
    await seedTableRecord("accounts", `ac-${acct.code}`, {
      business_id: DEMO_BUSINESS_ID,
      code: acct.code,
      name: acct.name,
      type: acct.type,
      balance: acct.balance,
      is_system: true,
      created_at: timestampISO
    });
  }

  // Seeding finished
  console.log("[Seeder] Best-effort database seeder completed successfully!");
}
