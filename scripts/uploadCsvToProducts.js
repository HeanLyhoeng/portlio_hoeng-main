/**
 * Upload CSV data to Supabase 'products' table
 * 
 * Usage:
 *   node scripts/uploadCsvToProducts.js path/to/products.csv
 * 
 * CSV Format (first row should be headers):
 *   name,price
 *   Product 1,19.99
 *   Product 2,29.99
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
config({ path: join(__dirname, '..', 'rootproject.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Error: Missing Supabase credentials in rootproject.env');
  console.error('   Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function uploadCsvToProducts(csvFilePath) {
  try {
    console.log(`📖 Reading CSV file: ${csvFilePath}`);
    
    // Read and parse CSV file (simple CSV parser)
    const csvContent = readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      throw new Error('CSV file must have at least a header row and one data row');
    }
    
    // Parse header
    const headers = lines[0].split(',').map(h => h.trim());
    
    // Parse data rows
    const records = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const record = {};
      headers.forEach((header, index) => {
        record[header] = values[index] || '';
      });
      records.push(record);
    }

    if (records.length === 0) {
      console.error('❌ Error: CSV file is empty or has no valid data');
      process.exit(1);
    }

    console.log(`📊 Found ${records.length} products to upload`);

    // Validate and transform data
    const products = records.map((record, index) => {
      const name = record.name || record.Name || record.product_name;
      const price = parseFloat(record.price || record.Price || record.product_price);

      if (!name) {
        throw new Error(`Row ${index + 2}: Missing 'name' field`);
      }
      if (isNaN(price) || price < 0) {
        throw new Error(`Row ${index + 2}: Invalid 'price' value: ${record.price}`);
      }

      return {
        name: name.trim(),
        price: price
      };
    });

    console.log('✅ Validated all products');
    console.log('📤 Uploading to Supabase...');

    // Upload to Supabase
    const { data, error } = await supabase
      .from('products')
      .insert(products)
      .select();

    if (error) {
      throw error;
    }

    console.log(`✅ Successfully uploaded ${data.length} products!`);
    console.log('\n📋 Uploaded products:');
    data.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - $${product.price}`);
    });

    return data;
  } catch (error) {
    console.error('❌ Error uploading CSV:', error.message);
    process.exit(1);
  }
}

// Get CSV file path from command line arguments
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.error('❌ Error: Please provide a CSV file path');
  console.error('   Usage: node scripts/uploadCsvToProducts.js path/to/products.csv');
  process.exit(1);
}

uploadCsvToProducts(csvFilePath);
