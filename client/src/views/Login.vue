<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout justify-center>
        <v-flex xs10 md6 lg4>
          
          <!-- login card START -->
          <v-card class="text-center mt-10" elevation="8">
            <v-toolbar color="primary">
              <v-toolbar-title class="white--text"
                >User Management System</v-toolbar-title
              >
            </v-toolbar>
            <v-card-text>
              <v-form v-model="isValid" @submit.prevent="login">
                <v-text-field
                  outlined
                  label="username"
                  type="text"
                  :rules="rules"
                  required
                  v-model="userInput"
                ></v-text-field>
                <v-btn
                  :disabled="!isValid"
                  :loading="isLoading"
                  @click="login"
                  color="primary"
                  class="white--text"
                  >Login</v-btn
                >
              </v-form>
            </v-card-text>
          </v-card>
          <!-- login card END -->

        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data: () => ({
    rules: [
      (v) => !!v || "Enter username",
      (v) => (v && v.length <= 10) || "Username must be less than 10 chars",
    ],
    isValid: false,
    isLoading: false,
    userInput: null,
  }),
  methods: {
    async login() {
      try {
        this.isLoading = true;
        const url = "http://localhost:5000/api/users";
        const user = { username: this.userInput };
        const { data } = await axios.post(url, user);
        this.$router.push({
          name: "Home",
          query: { CurrentStatus: data.status, UniqueID: data._id },
        });
      } catch (err) {
        alert('Login failed');
        console.log(err.response);
      }

      this.isLoading = false;
    },
  },
};
</script>
