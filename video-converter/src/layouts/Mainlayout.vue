<template>
  <div>
    <Navbar />
    <router-view />

    <!-- <Home /> -->
    <!-- <Introduction /> -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Home from '../components/Home.vue';
// import Introduction from '../components/introduction.vue';
import Footer from '../components/Footer.vue';
</script>
