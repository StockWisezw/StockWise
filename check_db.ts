import { appwrite } from './src/lib/appwrite.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const { data, error } = await appwrite.from('products').select('*').limit(1);
  if (error) {
    console.error('Appwrite check error:', error);
  } else {
    console.log('Appwrite check succeeded. Product items parsed:', data);
  }
}
run();
