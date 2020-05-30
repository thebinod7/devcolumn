1. Clone this project and create config folder inside project root directory.
2. Create local.json file.
3. Pase following config code.

{
  "app_url": "http://localhost:8888",
  "app": {
    "name": "devcolumn-exercise",
    "secret": "kajfeiesei8953hiaab425qwee9904vmmidee8",
    "db": "mongodb://localhost:27017/exercise",
    "salt_rounds": 10
  }
}

4. Go to project directory.
5. Run 'yarn install' without quotes.
6. Run 'yarn start'
7. Visit http://localhost:8888
