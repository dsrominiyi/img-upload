 #!/bin/bash 
 
mv ./src/config.json ./src/config.dev.json
mv ./src/config.prod.json ./src/config.json

npm run compile

scp -r public/* bitnami@52.56.137.29:htdocs/

mv ./src/config.json ./src/config.prod.json 
mv ./src/config.dev.json ./src/config.json
