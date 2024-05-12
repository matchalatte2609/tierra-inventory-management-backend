import chardet

with open('../data/masterFile.csv', 'rb') as file:
    print(chardet.detect(file.read()))
