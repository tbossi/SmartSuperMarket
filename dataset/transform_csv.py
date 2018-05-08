import pandas as pd
import re
import random

column_name = ['web-scraper-order', 'web-scraper-start-url', 'reparto', 'reparto-href', 'title', 'price']
df = pd.read_csv('ilgigantebig.csv', names = column_name)
print('\n--originale--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df[:-1]
print('\n--senza intestazione--')
print('line length', len(df.index))
print('column length', len(df.columns))

df = df.drop(['web-scraper-order', 'web-scraper-start-url', 'reparto-href'], axis = 1)
print('\n--senza colonne url--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Sistemo i prezzi con solo numeri floating point
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

discount_price = []
for index, row in df.iterrows():
	price = row['price']
	if (random.random() > 0.5):
		discount_price.append(price)
	else:
		discount_price.append(float("%.2f" % (price * random.uniform(0.45, 1))))

df['discount'] = discount_price
print('\n--aggiungo sconto--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo una quantità random:
availability = []
for index, row in df.iterrows():
	availability.append(random.randint(2, random.randint(1, 6) * 5))

df['availability'] = availability
print('\n--aggiungo quantità--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo uno scaffale random:
shelf = []
for index, row in df.iterrows():
	shelf.append('S' + str(random.randint(1, 5)))

df['shelf'] = shelf
print('\n--aggiungo scaffale--')
print('line length', len(df.index))
print('column length', len(df.columns))

# Aggiungo id
df = df.reset_index()
print('\n--aggiungo index--')
print('line length', len(df.index))
print('column length', len(df.columns))

df.rename(columns = {'reparto' : 'department', 'price' : 'original', 'availability' : 'value'}, inplace = True)
json_file = (df.groupby(['index', 'department', 'title', 'shelf', 'value'], as_index = False)
			  .apply(lambda x: {
			  		'original' : float(x.original),
			  		'discount' : float(x.discount),
			  		'currency' : "€"
			  		})
			  .reset_index()
			  .rename(columns = {0 : 'price'})
			  .groupby(['index', 'department', 'title'], as_index = False)
			  .apply(lambda x: x[['shelf','value']].to_dict('r'))
			  .reset_index()
			  .rename(columns = {0 : 'availability'})
			  .to_json(orient = 'records', force_ascii = False))

with open("smart_supermarket-dataset.json", "w", encoding = 'utf-8') as text_file:
	text_file.write(json_file)