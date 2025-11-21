from sqlalchemy import inspect
from database import engine

ins = inspect(engine)
cols = ins.get_columns('quality_scores')
print('Columns in quality_scores:')
for c in cols:
    print(' -', c['name'])
