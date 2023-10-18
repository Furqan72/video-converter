<template>
  <div>
    <Navbar />
    <router-view />
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue';
import Home from '../components/Home.vue';
import Footer from '../components/Footer.vue';
</script>
