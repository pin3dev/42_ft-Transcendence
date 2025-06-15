HTTPS_PORT=3000
WSS_PORT=3001
IS_ENVIRONMENT_TEST=true

install:
	JWT_PUBLIC_KEY_BASE64="a"
	SSL_KEY_BASE64="b"
	SSL_CERT_BASE64="c"
	npm init -y
	npm install --save-dev @types/jest @types/node jest ts-jest
	npm install --save @types/node @types/ws ts-node typescript ws

all: install
	npm run start -- HTTPS_PORT $(HTTPS_PORT) WSS_PORT $(WSS_PORT) IS_ENVIRONMENT_TEST $(IS_ENVIRONMENT_TEST)

all_http:
	npm run start -- HTTPS_PORT $(HTTPS_PORT) WSS_PORT $(WSS_PORT) IS_ENVIRONMENT_TEST $(IS_ENVIRONMENT_TEST)

test:
	npm run test