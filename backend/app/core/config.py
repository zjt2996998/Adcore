from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    mongo_details: str
    redis_url: str

    class Config(SettingsConfigDict):
        env_file = ".env"

settings = Settings()
