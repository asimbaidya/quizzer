import sys

from app.core.create_tables import create_all_tables, drop_all_tables


def main():
    if len(sys.argv) == 2 and sys.argv[1] == 'drop':
        print('Dropping all tables')
        drop_all_tables()
    elif len(sys.argv) == 1:
        print('Creating all tables')
        create_all_tables()
    else:
        print('Invalid argument')


if __name__ == '__main__':
    main()
