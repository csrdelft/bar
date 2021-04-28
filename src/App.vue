<template>
  <div id="nav">
    <router-link to="/">Persoonselectie</router-link> |
    <router-link to="/about">Invoer</router-link> |
    <router-link to="/auth/csr">Bestellingen</router-link> |
    <router-link to="/beheer">Beheer</router-link>
  </div>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
