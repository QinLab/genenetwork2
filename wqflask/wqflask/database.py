# Module to initialize sqlalchemy with flask

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from utility.tools import SQL_URI

import utility.logger
logger = utility.logger.getLogger(__name__ )


engine = create_engine(SQL_URI, convert_unicode=True)

db_session = scoped_session(sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine))
Base = declarative_base()
Base.query = db_session.query_property()

def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    #import yourapplication.models
    import wqflask.model
    logger.debug("Creating all model metadata")
    Base.metadata.create_all(bind=engine)
    logger.info("Done creating all model metadata")

init_db()
