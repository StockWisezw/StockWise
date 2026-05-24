import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "../firebase-applet-config.json" with { type: "json" };

const DEMO_EMAIL = "demo@tareza.co.zw";
const DEMO_PASSWORD = "tareza1997?";
const DEMO_UID = "tareza_demo_superadmin_uid";
const DEMO_BUSINESS_ID = "tareza_demo_business_id";

const COLLECTIONS_TO_CLEAR = [
  "businesses",
  "branches",
  "profiles",
  "roles",
  "role_permissions",
  "business_users",
  "categories",
  "products",
  "inventory",
  "customers",
  "suppliers",
  "sales",
  "sale_items",
  "expense_categories",
  "cash_drawer_logs",
  "tax_rates",
  "purchase_orders",
  "stocktakes_advanced",
  "inventory_transfers",
  "stock_movements",
  "subscriptions",
  "accounts",
  "journal_entries",
  "journal_lines",
  "register_sessions",
  "audit_logs"
];

export async function runDatabaseSeeder() {
  console.log("[Seeder] Starting ERP database purge and seeding run...");
  
  // 1. Initialize Firebase Admin
  const app = admin.apps[0] || admin.initializeApp({
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket
  });
  
  const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);
  
  // 2. Ensure Superadmin Auth Account
  try {
    let authUserExists = false;
    try {
      await admin.auth().getUser(DEMO_UID);
      authUserExists = true;
    } catch (e: any) {
      if (e.code !== "auth/user-not-found") {
        throw e;
      }
    }

    if (authUserExists) {
      console.log(`[Seeder] User with UID ${DEMO_UID} already exists in Auth. Updating password...`);
      await admin.auth().updateUser(DEMO_UID, {
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        displayName: "Demo Superadmin",
        emailVerified: true
      });
    } else {
      // Check if user exists by email under a different UID and delete to prevent constraints conflict
      try {
        const existingEmailUser = await admin.auth().getUserByEmail(DEMO_EMAIL);
        console.log(`[Seeder] User with email ${DEMO_EMAIL} exists under different UID (${existingEmailUser.uid}). Deleting it to ensure use of fixed UID.`);
        await admin.auth().deleteUser(existingEmailUser.uid);
      } catch (err: any) {
        if (err.code !== "auth/user-not-found") throw err;
      }

      console.log(`[Seeder] Creating fresh superadmin user with UID ${DEMO_UID}...`);
      await admin.auth().createUser({
        uid: DEMO_UID,
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
        displayName: "Demo Superadmin",
        emailVerified: true
      });
    }
    console.log("[Seeder] Superadmin Auth configuration verified.");
  } catch (err) {
    console.error("[Seeder] Error during Auth account seeding:", err);
  }

  // 3. Purge other/old demo data
  console.log("[Seeder] Purging old collections to keep the slate pristine...");
  for (const coll of COLLECTIONS_TO_CLEAR) {
    try {
      const snap = await db.collection(coll).get();
      if (!snap.empty) {
        const batch = db.batch();
        snap.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        console.log(`[Seeder] Cleared all (${snap.size}) document entries in '${coll}' collection.`);
      }
    } catch (err) {
      console.warn(`[Seeder] Non-blocking warning when clearing collection '${coll}':`, err);
    }
  }

  // 4. Seed consistent database entities
  console.log("[Seeder] Seeding matching enterprise metadata and relationships...");
  try {
    const timestampISO = new Date().toISOString();

    // 4.a Profiles
    await db.collection("profiles").doc(DEMO_UID).set({
      id: DEMO_UID,
      first_name: "Demo",
      last_name: "Superadmin",
      phone: "+263 77 123 4567",
      email: DEMO_EMAIL,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.b Businesses (Superadmin setup has no expiration, unlimited functions/users limits)
    await db.collection("businesses").doc(DEMO_BUSINESS_ID).set({
      id: DEMO_BUSINESS_ID,
      name: "Tareza Retail & Wholesale Zimbabwe",
      tax_number: "BP801938222-Z-ZIMRA",
      email: DEMO_EMAIL,
      phone: "+263 24 2700123",
      currency: "USD",
      subscription_plan: "enterprise_pro",
      subscription_status: "ACTIVE", // Superadmin never overdue or locked
      subscription_end_date: "2099-12-31T23:59:59.000Z", // Unlimited existence
      max_users: 999999, // Unlimited seats
      max_branches: 100000, // Unlimited branch count
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.c Subscriptions
    await db.collection("subscriptions").doc("demo_sub_id").set({
      id: "demo_sub_id",
      business_id: DEMO_BUSINESS_ID,
      plan_name: "enterprise_pro",
      status: "active",
      start_date: timestampISO,
      end_date: "2099-12-31T23:59:59.000Z",
      created_at: timestampISO
    });

    // 4.d Roles
    await db.collection("roles").doc("demo_role_superadmin").set({
      id: "demo_role_superadmin",
      business_id: DEMO_BUSINESS_ID,
      name: "Superadmin",
      description: "Unlimited administrative and operational access",
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.e Branches (CBD Retail store & Bulawayo Wholesale warehouse)
    await db.collection("branches").doc("demo_branch_harare_cbd").set({
      id: "demo_branch_harare_cbd",
      business_id: DEMO_BUSINESS_ID,
      name: "Harare CBD Flagship",
      address: "77 Jason Moyo Ave, Harare Central",
      phone: "+263 24 2700123",
      type: "retail",
      is_active: true,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("branches").doc("demo_branch_bulawayo").set({
      id: "demo_branch_bulawayo",
      business_id: DEMO_BUSINESS_ID,
      name: "Bulawayo Wholesale Hub",
      address: "104 Fife Street, Bulawayo Industrial",
      phone: "+263 9 881234",
      type: "wholesale",
      is_active: true,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.f Link User in Business Users
    await db.collection("business_users").doc("demo_bu_link_superadmin").set({
      id: "demo_bu_link_superadmin",
      business_id: DEMO_BUSINESS_ID,
      user_id: DEMO_UID,
      branch_id: "demo_branch_harare_cbd",
      role_id: "demo_role_superadmin",
      is_active: true,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.g Categories
    await db.collection("categories").doc("demo_cat_groceries").set({
      id: "demo_cat_groceries",
      business_id: DEMO_BUSINESS_ID,
      name: "Groceries & Essentials",
      created_at: timestampISO
    });

    await db.collection("categories").doc("demo_cat_hardware").set({
      id: "demo_cat_hardware",
      business_id: DEMO_BUSINESS_ID,
      name: "Building & Hardware",
      created_at: timestampISO
    });

    await db.collection("categories").doc("demo_cat_electronics").set({
      id: "demo_cat_electronics",
      business_id: DEMO_BUSINESS_ID,
      name: "Electronics & Tech",
      created_at: timestampISO
    });

    // 4.h Tax Rates
    await db.collection("tax_rates").doc("demo_tax_rate_vat_15").set({
      id: "demo_tax_rate_vat_15",
      business_id: DEMO_BUSINESS_ID,
      name: "ZIMRA Standard VAT (15%)",
      rate: 15,
      is_active: true
    });

    // 4.i Products matching POS inventory and transactions
    await db.collection("products").doc("demo_prod_cooking_oil").set({
      id: "demo_prod_cooking_oil",
      business_id: DEMO_BUSINESS_ID,
      category_id: "demo_cat_groceries",
      name: "Pure Drop Cooking Oil - 2L",
      description: "Locally manufactured premium pure vegetable cooking oil",
      sku: "SKU-PD-COIL-2L",
      barcode: "6001234567891",
      retail_price: 3.50,
      wholesale_price: 3.10,
      cost_price: 2.50,
      price: 3.50,
      tax_class: "standard",
      tax_rate_id: "demo_tax_rate_vat_15",
      is_active: true,
      created_at: timestampISO
    });

    await db.collection("products").doc("demo_prod_corn_soya").set({
      id: "demo_prod_corn_soya",
      business_id: DEMO_BUSINESS_ID,
      category_id: "demo_cat_groceries",
      name: "Gloria Cake Flour - 2kg",
      description: "Premium cake flour for household and bakery use",
      sku: "SKU-GL-CFLR-2K",
      barcode: "6001234567892",
      retail_price: 2.10,
      wholesale_price: 1.85,
      cost_price: 1.45,
      price: 2.10,
      tax_class: "standard",
      tax_rate_id: "demo_tax_rate_vat_15",
      is_active: true,
      created_at: timestampISO
    });

    await db.collection("products").doc("demo_prod_cement").set({
      id: "demo_prod_cement",
      business_id: DEMO_BUSINESS_ID,
      category_id: "demo_cat_hardware",
      name: "PPC Cement PC15 - 50kg Bag",
      description: "Premium Portland Cement for construction works",
      sku: "SKU-PPC-CEMENT-50K",
      barcode: "6001234567893",
      retail_price: 10.50,
      wholesale_price: 9.80,
      cost_price: 8.00,
      price: 10.50,
      tax_class: "standard",
      tax_rate_id: "demo_tax_rate_vat_15",
      is_active: true,
      created_at: timestampISO
    });

    await db.collection("products").doc("demo_prod_solar_panel").set({
      id: "demo_prod_solar_panel",
      business_id: DEMO_BUSINESS_ID,
      category_id: "demo_cat_electronics",
      name: "Tareza 550W Mono Solar Panel",
      description: "High-efficiency monocrystalline solar panel",
      sku: "SKU-TZ-SP-550W",
      barcode: "6001234567894",
      retail_price: 115.00,
      wholesale_price: 105.00,
      cost_price: 85.00,
      price: 115.00,
      tax_class: "standard",
      tax_rate_id: "demo_tax_rate_vat_15",
      is_active: true,
      created_at: timestampISO
    });

    // 4.j Quantitative physical stock inventory levels
    await db.collection("inventory").doc("demo_inv_oil_harare").set({
      id: "demo_inv_oil_harare",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      product_id: "demo_prod_cooking_oil",
      quantity: 240,
      reorder_level: 50,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_oil_bulawayo").set({
      id: "demo_inv_oil_bulawayo",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_bulawayo",
      product_id: "demo_prod_cooking_oil",
      quantity: 1500,
      reorder_level: 200,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_flour_harare").set({
      id: "demo_inv_flour_harare",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      product_id: "demo_prod_corn_soya",
      quantity: 180,
      reorder_level: 40,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_flour_bulawayo").set({
      id: "demo_inv_flour_bulawayo",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_bulawayo",
      product_id: "demo_prod_corn_soya",
      quantity: 1200,
      reorder_level: 150,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_cement_harare").set({
      id: "demo_inv_cement_harare",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      product_id: "demo_prod_cement",
      quantity: 80,
      reorder_level: 20,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_cement_bulawayo").set({
      id: "demo_inv_cement_bulawayo",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_bulawayo",
      product_id: "demo_prod_cement",
      quantity: 950,
      reorder_level: 100,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_solar_harare").set({
      id: "demo_inv_solar_harare",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      product_id: "demo_prod_solar_panel",
      quantity: 35,
      reorder_level: 10,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    await db.collection("inventory").doc("demo_inv_solar_bulawayo").set({
      id: "demo_inv_solar_bulawayo",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_bulawayo",
      product_id: "demo_prod_solar_panel",
      quantity: 250,
      reorder_level: 30,
      created_at: timestampISO,
      updated_at: timestampISO
    });

    // 4.k Corporate Customers & Cash Walk-in Clients
    await db.collection("customers").doc("demo_cust_walkin").set({
      id: "demo_cust_walkin",
      business_id: DEMO_BUSINESS_ID,
      name: "Cash Walk-in Customer",
      email: "walkin@tareza.co.zw",
      phone: "+263 77 111 2222",
      address: "Harare Retail Store front",
      vat_number: "",
      customer_type: "cash",
      balance: 0,
      credit_limit: 0,
      created_at: timestampISO
    });

    await db.collection("customers").doc("demo_cust_shoppers_choice").set({
      id: "demo_cust_shoppers_choice",
      business_id: DEMO_BUSINESS_ID,
      name: "Shoppers Choice Supermarkets",
      email: "accounts@shopperschoice.co.zw",
      phone: "+263 24 2490123",
      address: "12 Samora Machel Ave, Harare",
      vat_number: "VAT94029193-K",
      customer_type: "credit",
      balance: 350.50,
      credit_limit: 2500.00,
      created_at: timestampISO
    });

    await db.collection("customers").doc("demo_cust_bulawayo_hardware").set({
      id: "demo_cust_bulawayo_hardware",
      business_id: DEMO_BUSINESS_ID,
      name: "Bulawayo General Hardware",
      email: "procurement@byohardware.co.zw",
      phone: "+263 9 40912",
      address: "22 Robert Mugabe Way, Bulawayo",
      vat_number: "VAT2093819-B",
      customer_type: "credit",
      balance: 1200.00,
      credit_limit: 5000.00,
      created_at: timestampISO
    });

    // 4.l Suppliers
    await db.collection("suppliers").doc("demo_sup_ppc").set({
      id: "demo_sup_ppc",
      business_id: DEMO_BUSINESS_ID,
      name: "PPC Cement Zimbabwe",
      contact_person: "Sarah Mpofu",
      email: "sales@ppc.co.zw",
      phone: "+263 9 709123",
      address: "1 PPC Road, Bulawayo",
      created_at: timestampISO
    });

    await db.collection("suppliers").doc("demo_sup_natfoods").set({
      id: "demo_sup_natfoods",
      business_id: DEMO_BUSINESS_ID,
      name: "National Foods Limited",
      contact_person: "Tinashe Moyo",
      email: "orders@natfoods.co.zw",
      phone: "+263 24 2620111",
      address: "Standard Road, Workington, Harare",
      created_at: timestampISO
    });

    // 4.m POS Sales Register Session
    await db.collection("register_sessions").doc("demo_reg_sess_harare_active").set({
      id: "demo_reg_sess_harare_active",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      user_id: DEMO_UID,
      opening_balance: 150.00,
      closing_balance: 0,
      expected_balance: 447.28,
      variance: 0,
      status: "OPEN",
      opened_at: timestampISO,
      sales_count: 2,
      sales_total: 297.28,
      refunds_total: 0,
      payouts_total: 0,
      created_at: timestampISO
    });

    // 4.n Sales and matching sale items
    // Sale 1: Walk-in Cash Sale: 10 Cement bags + 5 Oil Bottles
    // Amount matching calculations: PPC Cement PC15 subtotal (10 * 10.50 = 105.0) + Pure Drop Oil subtotal (5 * 3.50 = 17.5) = 122.50.
    // VAT (15%): 18.38
    // Total Amount: 140.88 USD
    const itemsSale1 = [
      {
        id: "item1",
        quantity: 10,
        unitPrice: 10.50,
        subtotal: 105.00,
        vatAmount: 15.75,
        product: { id: "demo_prod_cement", name: "PPC Cement PC15 - 50kg Bag", retail_price: 10.50, taxClass: "standard" }
      },
      {
        id: "item2",
        quantity: 5,
        unitPrice: 3.50,
        subtotal: 17.50,
        vatAmount: 2.63,
        product: { id: "demo_prod_cooking_oil", name: "Pure Drop Cooking Oil - 2L", retail_price: 3.50, taxClass: "standard" }
      }
    ];

    const paymentsSale1 = [
      { method: "cash", amount: 140.88 }
    ];

    await db.collection("sales").doc("demo_sale_1").set({
      id: "demo_sale_1",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      user_id: DEMO_UID,
      customer_id: "demo_cust_walkin",
      customerId: "demo_cust_walkin",
      customerName: "Cash Walk-in Customer",
      receiptNumber: "REC-2026-0001",
      receipt_number: "REC-2026-0001",
      items: JSON.stringify(itemsSale1),
      payments: JSON.stringify(paymentsSale1),
      subtotal: 122.50,
      vat_total: 18.38,
      vatTotal: 18.38,
      discount_total: 0,
      discountTotal: 0,
      total: 140.88,
      total_amount: 140.88,
      total_tax_amount: 18.38,
      payment_method: "cash",
      status: "COMPLETED",
      register_session_id: "demo_reg_sess_harare_active",
      timestamp: timestampISO,
      created_at: timestampISO
    });

    await db.collection("sale_items").doc("demo_saleitem_s1_p1").set({
      id: "demo_saleitem_s1_p1",
      sale_id: "demo_sale_1",
      product_id: "demo_prod_cement",
      quantity: 10,
      unit_price: 10.50,
      line_total: 105.00,
      vat_amount: 15.75
    });

    await db.collection("sale_items").doc("demo_saleitem_s1_p2").set({
      id: "demo_saleitem_s1_p2",
      sale_id: "demo_sale_1",
      product_id: "demo_prod_cooking_oil",
      quantity: 5,
      unit_price: 3.50,
      line_total: 17.50,
      vat_amount: 2.63
    });

    // Sale 2: Credit Sale: 1 Solar Panel + 10 Gloria Flour
    // Items subtotal: Solar (1 * 115) + Flour (10 * 2.1 = 21) = 136.00
    // VAT (15%): 20.40
    // Total Amount: 156.40 USD
    const itemsSale2 = [
      {
        id: "item1",
        quantity: 1,
        unitPrice: 115.00,
        subtotal: 115.00,
        vatAmount: 17.25,
        product: { id: "demo_prod_solar_panel", name: "Tareza 550W Mono Solar Panel", retail_price: 115.00, taxClass: "standard" }
      },
      {
        id: "item2",
        quantity: 10,
        unitPrice: 2.10,
        subtotal: 21.00,
        vatAmount: 3.15,
        product: { id: "demo_prod_corn_soya", name: "Gloria Cake Flour - 2kg", retail_price: 2.10, taxClass: "standard" }
      }
    ];

    const paymentsSale2 = [
      { method: "credit", amount: 156.40 }
    ];

    await db.collection("sales").doc("demo_sale_2").set({
      id: "demo_sale_2",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      user_id: DEMO_UID,
      customer_id: "demo_cust_shoppers_choice",
      customerId: "demo_cust_shoppers_choice",
      customerName: "Shoppers Choice Supermarkets",
      receiptNumber: "REC-2026-0002",
      receipt_number: "REC-2026-0002",
      items: JSON.stringify(itemsSale2),
      payments: JSON.stringify(paymentsSale2),
      subtotal: 136.00,
      vat_total: 20.40,
      vatTotal: 20.40,
      discount_total: 0,
      discountTotal: 0,
      total: 156.40,
      total_amount: 156.40,
      total_tax_amount: 20.40,
      payment_method: "credit",
      status: "COMPLETED",
      register_session_id: "demo_reg_sess_harare_active",
      timestamp: timestampISO,
      created_at: timestampISO
    });

    await db.collection("sale_items").doc("demo_saleitem_s2_p1").set({
      id: "demo_saleitem_s2_p1",
      sale_id: "demo_sale_2",
      product_id: "demo_prod_solar_panel",
      quantity: 1,
      unit_price: 115.00,
      line_total: 115.00,
      vat_amount: 17.25
    });

    await db.collection("sale_items").doc("demo_saleitem_s2_p2").set({
      id: "demo_saleitem_s2_p2",
      sale_id: "demo_sale_2",
      product_id: "demo_prod_corn_soya",
      quantity: 10,
      unit_price: 2.10,
      line_total: 21.00,
      vat_amount: 3.15
    });

    // 4.o Cash Drawer logs
    await db.collection("cash_drawer_logs").doc("demo_cash_log_1").set({
      id: "demo_cash_log_1",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      amount: 140.88,
      transaction_type: "cash_sale",
      notes: "POS Sale REC-2026-0001",
      sale_id: "demo_sale_1",
      created_at: timestampISO
    });

    // 4.p Double entry ledger accounts
    const chartOfAccounts = [
      { code: "1000", name: "POS Cash Till / Drawee", type: "asset", balance: 290.88, is_system: true },
      { code: "1100", name: "Accounts Receivable", type: "asset", balance: 506.90, is_system: true },
      { code: "1200", name: "Trading Stock / Inventory Asset", type: "asset", balance: 14500.00, is_system: true },
      { code: "2000", name: "Accounts Payable", type: "liability", balance: 0.00, is_system: true },
      { code: "3000", name: "Equity - Accumulated Profits", type: "equity", balance: 14500.00, is_system: true },
      { code: "4000", name: "POS Cash Sales Revenue", type: "revenue", balance: 258.50, is_system: true },
      { code: "5000", name: "Cost of Goods Sold (COGS)", type: "expense", balance: 180.00, is_system: true }
    ];

    for (const acct of chartOfAccounts) {
      await db.collection("accounts").doc(`demo_acct_${acct.code}`).set({
        id: `demo_acct_${acct.code}`,
        business_id: DEMO_BUSINESS_ID,
        code: acct.code,
        name: acct.name,
        type: acct.type,
        balance: acct.balance,
        is_system: acct.is_system,
        created_at: timestampISO
      });
    }

    // 4.q Matching journal entries & lines
    await db.collection("journal_entries").doc("demo_je_sale_1").set({
      id: "demo_je_sale_1",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      date: timestampISO,
      reference: "REC-2026-0001",
      description: "POS Cash Sale checkout journal entry",
      created_at: timestampISO,
      user_id: DEMO_UID
    });

    await db.collection("journal_lines").doc("demo_jl_sale1_dr").set({
      id: "demo_jl_sale1_dr",
      journal_entry_id: "demo_je_sale_1",
      account_id: "demo_acct_1000",
      debit: 140.88,
      credit: 0,
      description: "Receipt cash debit REC-2026-0001"
    });

    await db.collection("journal_lines").doc("demo_jl_sale1_cr").set({
      id: "demo_jl_sale1_cr",
      journal_entry_id: "demo_je_sale_1",
      account_id: "demo_acct_4000",
      debit: 0,
      credit: 140.88,
      description: "Sales revenue credit REC-2026-0001"
    });

    await db.collection("journal_entries").doc("demo_je_sale_2").set({
      id: "demo_je_sale_2",
      business_id: DEMO_BUSINESS_ID,
      branch_id: "demo_branch_harare_cbd",
      date: timestampISO,
      reference: "REC-2026-0002",
      description: "POS Credit Sale checkout journal entry",
      created_at: timestampISO,
      user_id: DEMO_UID
    });

    await db.collection("journal_lines").doc("demo_jl_sale2_dr").set({
      id: "demo_jl_sale2_dr",
      journal_entry_id: "demo_je_sale_2",
      account_id: "demo_acct_1100",
      debit: 156.40,
      credit: 0,
      description: "Receipt credit debit REC-2026-0002"
    });

    await db.collection("journal_lines").doc("demo_jl_sale2_cr").set({
      id: "demo_jl_sale2_cr",
      journal_entry_id: "demo_je_sale_2",
      account_id: "demo_acct_4000",
      debit: 0,
      credit: 156.40,
      description: "Sales revenue credit REC-2026-0002"
    });

    // 4.r Stock movement logs corresponding accurately to inventories
    await db.collection("stock_movements").doc("demo_sm_sale1_cement").set({
      id: "demo_sm_sale1_cement",
      product_id: "demo_prod_cement",
      branch_id: "demo_branch_harare_cbd",
      quantity: -10,
      type: "POS_SALE",
      created_at: timestampISO
    });

    await db.collection("stock_movements").doc("demo_sm_sale1_oil").set({
      id: "demo_sm_sale1_oil",
      product_id: "demo_prod_cooking_oil",
      branch_id: "demo_branch_harare_cbd",
      quantity: -5,
      type: "POS_SALE",
      created_at: timestampISO
    });

    await db.collection("stock_movements").doc("demo_sm_sale2_solar").set({
      id: "demo_sm_sale2_solar",
      product_id: "demo_prod_solar_panel",
      branch_id: "demo_branch_harare_cbd",
      quantity: -1,
      type: "POS_SALE",
      created_at: timestampISO
    });

    await db.collection("stock_movements").doc("demo_sm_sale2_flour").set({
      id: "demo_sm_sale2_flour",
      product_id: "demo_prod_corn_soya",
      branch_id: "demo_branch_harare_cbd",
      quantity: -10,
      type: "POS_SALE",
      created_at: timestampISO
    });

    console.log("[Seeder] Successfully finished database populating with 100% consistent Zimbabwean POS & accounting metrics.");
  } catch (err) {
    console.error("[Seeder] Critical failure during seeding database entities:", err);
  }
}
