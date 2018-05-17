import pandas as pd
import re
import random

column_name = ['web-scraper-order', 'web-scraper-start-url', 'department', 'reparto-href', 'title', 'original_price']
df = pd.read_csv('ilgigantebig.csv', names=column_name)
print('\n--originale--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df[:-1]
print('\n--senza intestazione--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df.drop(['web-scraper-order', 'web-scraper-start-url', 'reparto-href'], axis=1)
print('\n--senza colonne url--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Sistemo i prezzi con solo numeri floating point
correct_price = []
for index, row in df.iterrows():
    price_str = row['original_price']
    num = re.findall("\d+\,\d+", str(price_str))
    if (len(num) != 0):
        correct_price.append(float(re.sub(',', '.', num[0])))
    else:
        correct_price.append('')
# print(correct_price)    
df['original_price'] = correct_price
print('\n--con prezzo numerico--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Elimino tutti quelli che hanno prezzo vuoto (c'erano dei price nil)
df = df[df['original_price'] != '']
print('\n--elimino colonne con prezzo non valido--')
print('line length', len(df.index))
print('column length', len(df.columns))

new_price = []
for index, row in df.iterrows():
    price = row['original_price']
    discount = price
    if (random.random() > 0.5):
        discount = float("%.2f" % (price * random.uniform(0.45, 1)))
    new_price.append({'original': price, 'discount': discount, 'currency': '€'})

df['price'] = new_price
print('\n--aggiungo sconto--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo una quantità random:
availability = []
for index, row in df.iterrows():
    value = random.randint(2, random.randint(1, 6) * 5)
    shelf = 'S' + str(random.randint(1, 5))
    availability.append({'value': value, 'shelf': shelf})

df['availability'] = availability
print('\n--aggiungo quantità--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo id
df = df.reset_index()
print('\n--aggiungo index--')
print('line length', len(df.index))
print('column length', len(df.columns))

json_file = df.to_json(orient='records', force_ascii=False)

with open("smart_supermarket-dataset.json", "w", encoding='utf-8') as text_file:
    text_file.write(json_file)
