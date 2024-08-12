import pandas as pd
import sys

def filter_csv(input_file, output_file, column_mapping):
    # Load the CSV file with the correct encoding, skipping the first row and setting the second row as header
    df = pd.read_csv(input_file, encoding='UTF-8', skiprows=1, header=0)
    
    # Rename columns based on the provided mapping
    df.rename(columns=column_mapping, inplace=True)
    
    # Select the necessary columns (the values from the mapping dictionary)
    selected_columns = df[list(column_mapping.values())]

    # Save the filtered data to a new CSV file
    selected_columns.to_csv(output_file, index=False, encoding='UTF-8')
    print(f"Filtered CSV created at: {output_file}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python csv_filtering_script.py <input_file> <output_file> <column_mapping>")
        print("Example: python csv_filtering_script.py ../data/masterFile.csv ../data/filtered_materials.csv")
    else:
        input_file = sys.argv[1]
        output_file = sys.argv[2]
        # Column mapping from Vietnamese to English
        column_mapping = {
            'STT': 'ProductId',
            # 'Shape1': 'Shape1',
            # 'Size1': 'Size1',
            # 'SL1': 'SL1',
            # 'Shape2': 'Shape2',
            # 'Size2': 'Size2',
            # 'SL2': 'SL2',
            # 'Shape3': 'Shape3',
            # 'Size3': 'Size3',
            # 'SL3': 'SL3',
            # 'Shape4': 'Shape4',
            # 'Size4': 'Size4',
            # 'SL4': 'SL4',
            # 'Shape5': 'Shape5',
            # 'Size5': 'Size5',
            # 'SL5': 'SL5',
            # 'Shape6': 'Shape6',
            # 'Size6': 'Size6',
            # 'SL6': 'SL6',
            # 'Shape7': 'Shape7',
            # 'Size7': 'Size7',
            # 'SL7': 'SL7',
            # 'Shape8': 'Shape8',
            # 'Size8': 'Size8',
            # 'SL8': 'SL8',
            # 'Shape9': 'Shape9',
            # 'Size9': 'Size9',
            # 'SL9': 'SL9',
            # 'Shape10': 'Shape10',
            # 'Size10': 'Size10',
            # 'SL10': 'SL10',
            'Mã Thiết Kế': 'design_code',
            'Tên gọi riêng': 'name',
            'Dòng hàng': 'category',
            'Đường kính vòng (cm)': 'diameter',
            'Ni': 'ring_size',
            'Kích thước độ DÀY ĐÁY - Mặc định':'base_thickness',
            'Kích thước độ RỘNG ĐÁY - Mặc định2':'base_width',
            'Kích thước chiều CAO ổ/chấu':'prongs_height',
            # 'Shape viên chủ': 'main_gemstone_shape',
            # 'Size viên chủ': 'main_gemstone_size',
            # 'Vàng 18k': 'gold_18k_weight',
            # 'Vàng 14k': 'gold_14k_weight',
            # 'Pt900': 'plat_900_weight',
            # 'Plain/Pattern': 'surface_plain_pattern',
            # 'Dia+18K': 'diamond_gold_18k',
            # 'Dia+14K': 'diamond_gold_14k',
            # 'Dia+Pt900': 'diamond_plat_900',
            # 'CZ+18K': 'cz_gold_18k',
            # 'CZ+14K': 'cz_gold_14k',
            # 'CZ+Pt900': 'cz_plat_900',
        }
        filter_csv(input_file, output_file, column_mapping)
