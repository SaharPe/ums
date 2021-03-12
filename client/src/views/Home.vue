<template>
  <v-main>
    <v-container fluid fill-height>
      <v-layout justify-center>
        <v-flex xs8 md4 lg4>

          <!-- info messages START -->
          <div class="messages">
            <h1>
              Hello <b class="primary--text">{{ connectedUser.username }}</b>
            </h1>
            <h2>
              Your current status is
              <b class="primary--text">{{ connectedUser.status }}</b>
            </h2>
            <h5 class="mt-4 primary--text">Update your current status:</h5>
          </div>
          <!-- info messages END -->

          <!-- update status START -->
          <v-select
            class="mt-3"
            label="Select new status"
            v-model="newSelectedStatus"
            outlined
            dense
            :items="statuses"
            @input="updateStatus"
          ></v-select>
          <!-- update status END -->

          <v-divider class="mb-5"></v-divider>

          <!-- user list filters START -->
          <div class="filters">
            <v-text-field
              label="Search by name..."
              v-model="searchText"
              outlined
              dense
              type="text"
            ></v-text-field>

            <v-select
              label="Search by status..."
              v-model="searchStatus"
              outlined
              dense
              :items="statuses"
              @input="getUsers"
            ></v-select>
          </div>
          <!-- user list filters END -->

          <!-- progress loading START -->
          <v-progress-circular
            v-if="isLoading"
            indeterminate
            color="primary"
            size="60"
          ></v-progress-circular>
          <!-- progress loading END -->

          <!-- user list START -->
          <v-card v-else rounded="12" elevation="12">
            <v-list two-line v-if="filteredUsers.length > 0">
              <v-list-item v-for="user in filteredUsers" :key="user.username">
                <v-list-item-avatar
                  ><v-avatar color="primary" size="40">
                    <v-icon>mdi-account-circle</v-icon>
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="title primary--text"
                    :style="{ fontSize: '30px' }"
                    v-text="user.username"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    class="gray--text"
                    v-text="user.status"
                  ></v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-card-subtitle v-else class="error--text"
              >No results..</v-card-subtitle>
          </v-card>
          <!-- user list END -->

          <!-- logout button START -->
          <v-btn
            class="logout"
            color="error lighten-1 mt-4"
            xsmall
            block
            @click="$router.push('/login')"
            >Logout</v-btn>
          <!-- logout button END -->

        </v-flex>
      </v-layout>
    </v-container>
  </v-main>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data: () => ({
    connectedUser: { _id: "", username: "", status: "" },
    statuses: ["Working", "OnVacation", "LunchTime", "BusinessTrip"],
    newSelectedStatus: "",
    users: [],
    isLoading: true,

    searchText: "",
    searchStatus: "",
  }),
  computed: {
    filteredUsers() {
      return this.users.filter((user) => {
        if (this.searchStatus !== "") {
          return (
            user.username.includes(this.searchText) &&
            user.status === this.searchStatus
          );
        } else {
          return user.username.includes(this.searchText);
        }
      });
    },
  },
  methods: {
    async updateStatus() {
      try {
        const url = `http://localhost:5000/api/users/${this.connectedUser._id}`;
        const newStatus = { status: this.newSelectedStatus };
        const { data } = await axios.patch(url, newStatus);
        this.connectedUser.status = data.status;
        this.$router.replace({
          name: "Home",
          query: { CurrentStatus: data.status, UniqueID: data._id },
        });

        await this.getUsers();
      } catch (err) {
        console.log(err.response);
      }
    },
    async getUser() {
      try {
        const url = `http://localhost:5000/api/users/${this.connectedUser._id}`;
        const { data } = await axios.get(url);
        this.connectedUser.username = data.username;
        this.connectedUser.status = data.status;
      } catch (err) {
        console.log(err.response);
      }
    },
    async getUsers() {
      try {
        const url = `http://localhost:5000/api/users`;
        const { data } = await axios.get(url);
        this.isLoading = false;
        this.users = data;
      } catch (err) {
        console.log(err.response);
      }
    },
  },
  async created() {
    try {
      this.connectedUser._id = this.$route.query.UniqueID;
      await this.getUser();
      await this.getUsers();
    } catch (err) {
      console.log(err.response);
    }
  },
};
</script>
