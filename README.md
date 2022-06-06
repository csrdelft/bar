# bar

## Oauth setup

Voer het volgende commando uit op je lokale test-stek om een nieuwe oauth applicatie met goede redirect-uri te registreren.

```bash
php bin/console trikoder:oauth2:create-client --redirect-uri http://localhost:8080/auth/callback bar
```

Voeg een `.env.local` bestand toe met de volgende inhoud.

```
VUE_APP_OAUTH2_CLIENT_ID=bar
VUE_APP_REMOTE_URL=http://dev-csrdelft.nl
```

`VUE_APP_OAUTH2_CLIENT_ID` is de naam van de oauth client die je zojuist hebt aangemaakt. Als deze `bar` is hoef je deze instelling niet te zetten.

`VUE_APP_REMOTE_URL` is de url van je lokale stek.

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
