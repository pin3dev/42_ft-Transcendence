HTTPS_PORT=3000
WSS_PORT=3001
IS_ENVIRONMENT_TEST=true

install:
	npm init -y
	npm install --save-dev @types/jest @types/node jest ts-jest
	npm install --save @types/node @types/ws ts-node typescript ws

all: install
	npm run start -- HTTPS_PORT $(HTTPS_PORT) WSS_PORT $(WSS_PORT) IS_ENVIRONMENT_TEST $(IS_ENVIRONMENT_TEST)

test:
	npm run test