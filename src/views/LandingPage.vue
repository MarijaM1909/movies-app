<template>
  <v-container class="landing-container text-center my-10">
    <h1 class="mb-4">🎬 Filmoteka </h1>
    <p>
      Svi filmovi na jednom mjestu!
    </p>
    <v-btn color="primary" class="mt-6" to="/filmovi">➡ Pogledaj filmove</v-btn>
  </v-container>
</template>

<script>
export default {
  name: "LandingPage",
};
</script>

<style scoped>
.landing-container {
  background-image: url('https://media.istockphoto.com/id/1391013277/vector/realistic-film-stripe-wave-on-blue-background-with-place-for-text-modern-3d-isometric-film.jpg?s=612x612&w=0&k=20&c=HjOQAt6S-ZNh69WRF91LyBPEsVel3Ct0AawbPj8MQBM=');
  background-size: cover;
  background-position: center;
  min-height: 100vh; 
  padding-top: 50px;
  color: white; 
  text-shadow: 1px 1px 3px rgba(0,0,0,0.7); 
}
</style>
