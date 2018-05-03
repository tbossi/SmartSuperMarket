import pandas as pd
import re

column_name = ['web-scraper-order', 'web-scraper-start-url',
               'reparto', 'reparto-href', 'title', 'price']
df = pd.read_csv(
    'ilgigantebig.csv',
    names=column_name
)
print('\n--originale--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df[:-1]
print('\n--senza intestazione--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df.drop(
    ['web-scraper-order', 'web-scraper-start-url', 'reparto-href'], axis=1)
print('\n--senza colonne url--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Sistemo i prezzi con solo numeri float in point
correct_price = []
for index, row in df.iterrows():
    price_str = row['price']
    num = re.findall("\d+\,\d+", str(price_str))
    if (len(num) != 0):
        correct_price.append(float(re.sub(',', '.', num[0])))
    else:
        correct_price.append('')
# print(correct_price)    
df['price'] = correct_price
print('\n--con prezzo numerico--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Elimino tutti quelli che hanno prezzo vuoto (c'erano dei price nil)
df = df[df['price'] != '']
print('\n--elimino colonne con prezzo non valido--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo id
df = df.reset_index()
print('\n--aggiungo index--')
print('line length', len(df.index))
print('column length', len(df.columns))

json_file = df.to_json(orient='records')
with open("supermarket.json", "w") as text_file:
    text_file.write(json_file)