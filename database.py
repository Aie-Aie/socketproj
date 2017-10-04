from sqlalchemy import create_engine
import os

class DBconnection:
    def __init__(self):
        #format ("{postgres}://{username}:{password}@{host}/{database}".
        engine = create_engine("postgres://postgres:analog@127.0.0.1:5432/packages", echo=False)
        self.conn =engine.connect()
        self.trans =self.conn.begin()

#traverse the records of the database
    def getcursor(self):
        cursor =self.conn.connection.cursor()
        return cursor

    #commits the current transaction
    def dbcommit(self):
        self.trans.commit()