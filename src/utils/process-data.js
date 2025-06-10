import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  masterFile: path.join(__dirname, '..', '..', 'data', 'masterFile.csv'),
  outputDir: path.join(__dirname, '..', '..', 'src', 'seeds'), // Output to src/seeds directory
  skipRows: 1, // Skip the first row as per your Python script
};

// Column mappings for different data categories
const COLUMN_MAPPINGS = {
  materials: {
    inputColumns: ['STT', 'Shape viên chủ', 'Size viên chủ', 'Vàng 18k', 'Vàng 14k', 'Pt900', 'Plain/Pattern', 'Màu sắc mặc định Catalogue'],
    outputColumns: ['ProductId', 'main_gemstone_shape', 'main_gemstone_size', 'gold_18k_weight', 'gold_14k_weight', 'plat_900_weight', 'surface_plain_pattern', 'catalogue_color']
  },
  products: {
    inputColumns: ['STT', 'Mã Thiết Kế', 'Tên gọi riêng', 'Dòng hàng', 'Đường kính vòng (cm)', 'Ni', 'Kích thước độ DÀY ĐÁY - Mặc định', 'Kích thước độ RỘNG ĐÁY - Mặc định2', 'Kích thước chiều CAO ổ/chấu'],
    outputColumns: ['ProductId', 'design_code', 'name', 'category', 'diameter', 'ring_size', 'base_thickness', 'base_width', 'prongs_height']
  },
  pricing: {
    inputColumns: ['STT', 'Dia+18K', 'Dia+14K', 'Dia+Pt900', 'CZ+18K', 'CZ+14K', 'CZ+Pt900', 'CZ+10K'],
    outputColumns: ['ProductId', 'diamond_gold_18k', 'diamond_gold_14k', 'diamond_plat_900', 'cz_gold_18k', 'cz_gold_14k', 'cz_plat_900', 'cz_gold_10k']
  },
  shapes: {
    inputColumns: ['STT', 'Shape1', 'Size1', 'SL1', 'Shape2', 'Size2', 'SL2', 'Shape3', 'Size3', 'SL3', 'Shape4', 'Size4', 'SL4', 'Shape5', 'Size5', 'SL5', 'Shape6', 'Size6', 'SL6', 'Shape7', 'Size7', 'SL7', 'Shape8', 'Size8', 'SL8', 'Shape9', 'Size9', 'SL9', 'Shape10', 'Size10', 'SL10', 'New version'],
    outputColumns: ['ProductId', 'Shape1', 'Size1', 'SL1', 'Shape2', 'Size2', 'SL2', 'Shape3', 'Size3', 'SL3', 'Shape4', 'Size4', 'SL4', 'Shape5', 'Size5', 'SL5', 'Shape6', 'Size6', 'SL6', 'Shape7', 'Size7', 'SL7', 'Shape8', 'Size8', 'SL8', 'Shape9', 'Size9', 'SL9', 'Shape10', 'Size10', 'SL10', 'new_ver']
  }
};

// Utility function to ensure directory exists
const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

// Utility function to clean and convert data
const cleanValue = (value) => {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  // Try to convert to number if it's a numeric string
  if (typeof value === 'string') {
    const trimmed = value.trim();
    const num = parseFloat(trimmed);
    if (!isNaN(num) && isFinite(num)) {
      return num;
    }
    return trimmed;
  }
  
  return value;
};

// Function to read and properly parse the CSV with complex headers
const readMasterFile = () => {
  try {
    const fileContent = fs.readFileSync(CONFIG.masterFile, 'utf8');
    
    // Parse with PapaParse to handle the complex structure
    const parsed = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: false,
      delimitersToGuess: [',', '\t', '|', ';']
    });
    
    if (parsed.errors.length > 0) {
      console.log('⚠️  Parse warnings:', parsed.errors.slice(0, 3));
    }
    
    // The first row contains the actual headers, so we need to reconstruct
    const actualHeaders = {};
    const firstRow = parsed.data[0];
    
    // Map the detected fields to actual column names from first row
    parsed.meta.fields.forEach((field, index) => {
      const actualHeader = Object.values(firstRow)[index];
      if (actualHeader && typeof actualHeader === 'string') {
        actualHeaders[field] = actualHeader.trim();
      }
    });
    
    console.log('📋 Detected column mapping (first 10):');
    Object.entries(actualHeaders).slice(0, 10).forEach(([key, value]) => {
      console.log(`  "${key}" -> "${value}"`);
    });
    
    return { parsed, actualHeaders };
  } catch (error) {
    throw new Error(`Failed to read master file: ${error.message}`);
  }
};

// Main processing function
const processDataset = (datasetName, mapping, parsedData, actualHeaders) => {
  const data = [];
  
  console.log(`🔄 Processing ${datasetName}...`);
  
  try {
    // Skip the first row (which contains headers) and process actual data
    const dataRows = parsedData.data.slice(1);
    
    dataRows.forEach((row, index) => {
      // Create filtered row with renamed columns
      const filteredRow = {};
      
      mapping.inputColumns.forEach((inputCol, mappingIndex) => {
        const outputCol = mapping.outputColumns[mappingIndex];
        
        // Find the actual column key that corresponds to our input column
        let actualValue = null;
        
        // Look for the column by matching the Vietnamese header name
        for (const [detectedField, vietnameseHeader] of Object.entries(actualHeaders)) {
          if (vietnameseHeader === inputCol || vietnameseHeader.trim() === inputCol.trim()) {
            actualValue = row[detectedField];
            break;
          }
        }
        
        filteredRow[outputCol] = cleanValue(actualValue);
      });
      
      data.push(filteredRow);
    });
    
    // Write files
    const csvOutputPath = path.join(CONFIG.outputDir, `${datasetName}.csv`);
    const jsonOutputPath = path.join(CONFIG.outputDir, `${datasetName}.json`);
    
    // Write CSV
    const csvHeader = mapping.outputColumns.join(',') + '\n';
    const csvContent = data.map(row => 
      mapping.outputColumns.map(col => {
        const value = row[col];
        // Wrap in quotes if it contains comma or is a string
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      }).join(',')
    ).join('\n');
    
    fs.writeFileSync(csvOutputPath, csvHeader + csvContent, 'utf8');
    
    // Write JSON
    fs.writeFileSync(jsonOutputPath, JSON.stringify(data, null, 2), 'utf8');
    
    console.log(`✅ ${datasetName}: ${data.length} records`);
    console.log(`   📄 CSV: ${csvOutputPath}`);
    console.log(`   📄 JSON: ${jsonOutputPath}`);
    
    return { name: datasetName, count: data.length };
    
  } catch (error) {
    throw new Error(`Error processing ${datasetName}: ${error.message}`);
  }
};

// Main execution function
const main = async () => {
  console.log('🚀 Starting unified data processing...\n');
  
  // Check if master file exists
  if (!fs.existsSync(CONFIG.masterFile)) {
    console.error(`❌ Master file not found: ${CONFIG.masterFile}`);
    process.exit(1);
  }
  
  // Ensure output directory exists
  ensureDirectoryExists(CONFIG.outputDir);
  
  try {
    // Read and parse the master file
    console.log('📖 Reading master file...');
    const { parsed, actualHeaders } = readMasterFile();
    
    console.log(`📊 Found ${parsed.data.length} total rows`);
    console.log(`📋 Detected ${Object.keys(actualHeaders).length} columns\n`);
    
    const results = [];
    
    // Process all datasets
    for (const [datasetName, mapping] of Object.entries(COLUMN_MAPPINGS)) {
      const result = processDataset(datasetName, mapping, parsed, actualHeaders);
      results.push(result);
    }
    
    // Summary
    console.log('\n📊 Processing Summary:');
    console.log('='.repeat(40));
    results.forEach(result => {
      console.log(`${result.name.padEnd(12)}: ${result.count} records`);
    });
    console.log('='.repeat(40));
    console.log(`Total datasets: ${results.length}`);
    console.log(`Output directory: ${CONFIG.outputDir}`);
    console.log('\n✨ All files processed successfully!');
    
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    process.exit(1);
  }
};

// Run the script
main().catch(error => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});