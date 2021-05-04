# Barsysteem C.S.R.

Maak een `.env.local` bestand aan met daar in het volgende, met de url van je eigen testomgevin erin:

```
VUE_APP_REMOTE_URL=http://dev-csrdelft.nl
```

Zorg er ook voor dat er een `bar` oauth2 applicatie bestaat in je testomgeving, deze applicatie moet de volgende instellingen hebben:

```
redirect-uri: http://localhost:8080/auth/callback
grant-type: token
```

Als dit niet goed ingesteld staat kun je niet inloggen en autoriseren.

## Project setup

Een standaard vue-cli setup.

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

## Design

_Dit is een werk in uitvoering_

### Auth Flow

1. Gebruiker komt aan op `bar.csrdelft.nl`
1. Gebruiker klikt op **Login**
1. Gebruiker wordt naar `csrdelft.nl/authorize` gestuurd
1. Gebruiker krijgt een qr code te zien en scant deze met een mobiele telefoon
1. Gebruiker autoriseert de sessie op de mobiele telefoon
1. Gebruiker wordt teruggestuurd naar `bar.csrdelft.nl` met een `access_token`
1. Gebruiker kan nu _n_ uur het barsysteem gebruiken totdat de token verloopt.

De Oauth2 implementatie van de stek kan worden gebruikt. Voor een losstaande web-app is alleen token autorisatie zonder secret mogelijk, dit geeft alleen een `access_token` en geen `refresh_token`. De sessie is dus afgelopen als de `access_token` verloopt.

De Oauth2 implementatie van de stek moet worden uitgebreid om ook sessies te kunnen autoriseren vanaf een mobiele telefoon. Dat is voor dit systeem extra belangrijk omdat het op een vaste pc zal draaien waar niet iedereen op in moet gaan loggen.

## Frontend

| Library           | Versie  | Beschrijving
|-------------------|:-------:|---
| `vue`             | 3       | Renderen, reactive ui
| `vuex`            | 4       | State management
| `vue-router`      | 4       | Routes
| `axios`           | 0.21    | Requests
| `client-oauth2`   | 4       | Oauth2. Redirect, lees token, sign request
| `element-plus`    | 1 (beta)| Vue 3 component library
| `simple-keyboard` | 3       | Virtueel toetsenbord

