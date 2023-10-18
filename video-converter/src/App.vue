<template>
  <!-- <div> -->
  <!-- <Navbar />
    <Home />
    <Introduction />
    <Footer /> -->
  <router-view />
  <!-- </div> -->
</template>

<script setup>
import Navbar from './components/Navbar.vue';
import Home from './components/Home.vue';
import Introduction from './components/Introduction.vue';
import Footer from './components/Footer.vue';
</script>
