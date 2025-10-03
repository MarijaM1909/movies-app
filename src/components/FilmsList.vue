<template>
  <v-container>
    <h2 class="mb-6 text-center">🎬 Popis filmova</h2>

    <v-alert v-if="errorMessage" type="error" dismissible class="mb-4">
      {{ errorMessage }}
    </v-alert>
    <v-alert v-if="successMessage" type="success" dismissible class="mb-4">
      {{ successMessage }}
    </v-alert>
<!-- za pretragu i filtriranje -->
    <v-row class="mb-4">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="searchQuery"
          label="🔎 Pretražite film"
          clearable
          @keyup.enter="currentPage=1"
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="selectedGenre"
          :items="genres"
          item-title="name"
          item-value="id"
          label="🎭 Odaberite žanr"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-select
          v-model="sortOrder"
          :items="['Najnoviji prvo','Najstariji prvo']"
          label="Filtriraj po starosti"
          clearable
        />
      </v-col>
    </v-row>

    <!-- lista filmova -->
    <v-row>
      <v-col
        v-for="film in paginatedFilms"
        :key="film.id"
        cols="12"
        sm="6"
        md="3"
      >
        <v-card>
          <!-- 🔹 FIX za poster: radi i s DataURL i s TMDB putanjom -->
          <v-img
            :src="film.poster_path?.startsWith('data:')
                    ? film.poster_path
                    : film.poster_path
                      ? 'https://image.tmdb.org/t/p/w500' + film.poster_path
                      : 'https://via.placeholder.com/300x450?text=Nema+slike'"
            height="300px"
          />
          <v-card-title>{{ film.title }}</v-card-title>
          <v-card-subtitle>
            {{ film.release_date ? formatDate(film.release_date) : 'Nepoznato' }}
          </v-card-subtitle>
          <v-card-text>
            {{ film.overview ? film.overview.slice(0, 80) + "..." : "Nema opisa." }}
          </v-card-text>
          <v-card-actions>
            <v-btn small color="green" @click="startEdit(film)">✏ Uredi</v-btn>
            <v-btn small color="red" @click="deleteFilm(film.id)">🗑 Obriši</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- paginacija -->
    <v-row class="mt-6" justify="center">
      <v-pagination
        v-model="currentPage"
        :length="totalPages"
        total-visible="7"
      />
    </v-row>

    <!-- dodavanje novog filma -->
    <v-card class="mt-10 pa-6">
      <h3>➕ Dodaj novi film</h3>

      <v-text-field v-model="newFilm.title" label="Naslov" />
      <v-text-field v-model="newFilm.release_date" label="Godina" />
      <v-textarea v-model="newFilm.overview" label="Opis" />

      <!-- dodavanje slike sa racunala -->
      <v-file-input
        v-model="newFilm.file"
        label="Odaberite poster sa računala"
        accept="image/*"
        show-size
        @change="previewImage"
      />

      <!-- pregled slike -->
      <v-img
        v-if="newFilm.poster_path"
        :src="newFilm.poster_path"
        height="300px"
      />

      <v-btn color="primary" @click="addFilm">Dodaj film</v-btn>
    </v-card>

    <v-dialog v-model="editDialog" persistent max-width="500px">
      <v-card>
        <v-card-title>✏ Uredi film</v-card-title>
        <v-card-text>
          <v-text-field v-model="editingFilm.title" label="Naslov" />
          <v-text-field v-model="editingFilm.release_date" label="Godina" />
          <v-textarea v-model="editingFilm.overview" label="Opis" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" @click="saveEdit">Spremi</v-btn>
          <v-btn color="grey" @click="cancelEdit">Odustani</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import dayjs from "dayjs";

export default {
  name: "FilmsList",
  data() {
    return {
      films: [],
      searchQuery: "",
      selectedGenre: null,
      genres: [
        { id: 28, name: "Akcija" },
        { id: 35, name: "Komedija" },
        { id: 18, name: "Drama" },
        { id: 10749, name: "Romantika" },
        { id: 27, name: "Horor" },
        { id: 16, name: "Animirani" },
      ],
      currentPage: 1,
      itemsPerPage: 8,
      sortOrder: 'Najnoviji prvo',
      errorMessage: "",
      successMessage: "",
      newFilm: {
        title: "",
        release_date: "",
        overview: "",
        file: null,
        poster_path: "",
      },
      editDialog: false,
      editingFilm: {},
    };
  },
  computed: {
    filteredFilms() {
      return this.films
        .filter(f => {
          return f.title.toLowerCase().includes(this.searchQuery.toLowerCase());
        })
        .filter(f => {
          if (!this.selectedGenre) return true;
          return f.genre_ids?.includes(this.selectedGenre);
        });
    },
    sortedFilms() {
      return [...this.filteredFilms].sort((a, b) => {
        if (!a.release_date) return 1;
        if (!b.release_date) return -1;
        return this.sortOrder === 'Najstariji prvo'
          ? dayjs(a.release_date).unix() - dayjs(b.release_date).unix()
          : dayjs(b.release_date).unix() - dayjs(a.release_date).unix();
      });
    },
    paginatedFilms() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.sortedFilms.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.sortedFilms.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchFilms() {
      try {
        const endpoint = this.searchQuery
          ? "https://api.themoviedb.org/3/search/movie"
          : "https://api.themoviedb.org/3/movie/popular";

        const response = await axios.get(endpoint, {
          params: {
            api_key: "f64f4f2f7581eba7f80aab57cbe4ce2d",
            query: this.searchQuery,
            language: "hr-HR",
          },
        });
        this.films = response.data.results;
        this.errorMessage = "";
      } catch (err) {
        this.errorMessage = "Greška pri dohvaćanju filmova.";
      }
    },
    formatDate(date) {
      return dayjs(date).format("DD.MM.YYYY");
    },
    addFilm() {
      if (!this.newFilm.title) {
        this.errorMessage = "Naslov je obavezan.";
        return;
      }
      this.films.unshift({ ...this.newFilm, id: Date.now() });
      this.successMessage = `Film "${this.newFilm.title}" dodan!`;
      this.newFilm = { title: "", release_date: "", poster_path: "", overview: "", file: null };
    },
    deleteFilm(id) {
      this.films = this.films.filter((f) => f.id !== id);
      this.successMessage = "Film obrisan!";
    },
    startEdit(film) {
      this.editingFilm = { ...film };
      this.editDialog = true;
    },
    saveEdit() {
      const index = this.films.findIndex((f) => f.id === this.editingFilm.id);
      if (index !== -1) this.films[index] = { ...this.editingFilm };
      this.successMessage = "Film ažuriran!";
      this.editDialog = false;
    },
    cancelEdit() {
      this.editDialog = false;
    },
    previewImage() {
      const file = this.newFilm.file;
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        this.newFilm.poster_path = reader.result;
      };
      reader.readAsDataURL(file);
    }
  },
  mounted() {
    this.fetchFilms();
  },
};
</script>
