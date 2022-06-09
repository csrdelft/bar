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

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install
```

## Development Server

Start the development server on http://localhost:3000

```bash
yarn dev
```

## Production

Build the application for production:

```bash
yarn build
```

Locally preview production build:

```bash
yarn preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

