<template>
  <v-container>
    <h2 class="mb-6">📽️ Popularni filmovi</h2>
    <FilmsList />
  </v-container>
</template>

<script>
import FilmsList from "../components/FilmsList.vue";

export default {
  name: "FilmoviPage",
  components: { FilmsList },
};
</script>
