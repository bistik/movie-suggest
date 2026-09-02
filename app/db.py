from sqlmodel import SQLModel, Field, create_engine, Session, select
from pathlib import Path

current_dir = Path(__file__).resolve().parent
outside_db_path = current_dir.parent / "tmdbdf.db"
db_url = f"sqlite:///{outside_db_path.as_posix()}"

engine = create_engine(db_url, echo=True, connect_args={"check_same_thread": False})

class MovieTitle(SQLModel):
    id: int
    title: str

class Movie(SQLModel, table=True):
    __tablename__ = "movies"
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    overview: str

def select_movies_by_title(title: str):
    with Session(engine) as session:
        statement = select(Movie).where(Movie.title.ilike(f"%{title}%"))
        return session.exec(statement).all()

def create_database():
    SQLModel.metadata.create_all(engine)
