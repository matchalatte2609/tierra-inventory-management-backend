#!/bin/bash

# Data Processing Script for Tierra Inventory Management
# This script processes the master CSV file and generates filtered CSV and JSON files

echo "🚀 Starting Data Processing for Tierra Inventory..."
echo "================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if we're in the right directory (should have package.json)
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if master file exists
if [ ! -f "data/masterFile.csv" ]; then
    echo "❌ masterFile.csv not found in data/ directory"
    echo "Please ensure your master CSV file is located at: data/masterFile.csv"
    exit 1
fi

# Create directories if they don't exist
mkdir -p src/utils
mkdir -p src/seeds
mkdir -p data

# Run the processing script
echo "🔄 Processing data with npm script..."
npm run process-data

# Check if processing was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Data processing completed successfully!"
    echo "📁 Output files are in the 'src/seeds' directory:"
    echo ""
    ls -la src/seeds/ | grep -E '\.(csv|json)
    echo ""
    echo "💡 You can now run 'npm run seed' to populate your database!"
else
    echo "❌ Data processing failed!"
    exit 1
fi