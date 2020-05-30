Create config folder inside project root directory.
Create local.json file.
Pase following config code.
{
  "app_url": "http://localhost:8888",
  "app": {
    "name": "devcolumn-exercise",
    "secret": "kajfeiesei8953hiaab425qwee9904vmmidee8",
    "db": "mongodb://localhost:27017/exercise",
    "salt_rounds": 10
  }
}

Go to project directory.
Run 'yarn install' without quotes.
Run 'yarn start'
