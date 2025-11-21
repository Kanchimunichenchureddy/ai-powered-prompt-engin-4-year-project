from sqlalchemy import inspect, text
from database import engine

TABLE_NAME = 'quality_scores'

def column_exists(inspector, table, column_name):
    cols = [c['name'] for c in inspector.get_columns(table)]
    return column_name in cols


def main():
    inspector = inspect(engine)
    with engine.connect() as conn:
        # completeness
        if not column_exists(inspector, TABLE_NAME, 'completeness'):
            print('Adding column: completeness')
            conn.execute(text(f"ALTER TABLE {TABLE_NAME} ADD COLUMN completeness FLOAT DEFAULT 0.0"))
        else:
            print('Column completeness already exists')

        # structure
        if not column_exists(inspector, TABLE_NAME, 'structure'):
            print('Adding column: structure')
            conn.execute(text(f"ALTER TABLE {TABLE_NAME} ADD COLUMN structure FLOAT DEFAULT 0.0"))
        else:
            print('Column structure already exists')

        # practicality
        if not column_exists(inspector, TABLE_NAME, 'practicality'):
            print('Adding column: practicality')
            conn.execute(text(f"ALTER TABLE {TABLE_NAME} ADD COLUMN practicality FLOAT DEFAULT 0.0"))
        else:
            print('Column practicality already exists')

    print('Migration complete')

if __name__ == '__main__':
    main()
