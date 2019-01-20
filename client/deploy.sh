 #!/bin/bash 
 
mv ./src/config.json ./src/config.dev.json
mv ./src/config.prod.json ./src/config.json

npm run compile

scp -r public/* bitnami@parallax.lifeandartmedia.co.uk:htdocs/

mv ./src/config.json ./src/config.prod.json 
mv ./src/config.dev.json ./src/config.json
