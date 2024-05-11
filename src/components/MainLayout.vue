<template>
  <v-layout>
    <v-app-bar title="Jestruvec web site" color="primary" />

    <v-navigation-drawer
      v-model="showSidebar"
      color="secondary"
      elevation="10"
      permanent
    >
      <v-list>
        <v-list-item
          prepend-avatar="https://i.pinimg.com/736x/e0/4d/a0/e04da00017705cf64203acf6f166d717.jpg"
          subtitle="jestruvec@gmail.com"
          title="Jhonny Estruve"
        ></v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <RouterLink
          v-for="(item, itemIdx) in navItems"
          :key="itemIdx"
          :to="item.path"
        >
          <v-list-item
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item.value"
          >
          </v-list-item>
        </RouterLink>
      </v-list>

      <div
        @click="showSidebar = !showSidebar"
        class="absolute w-6 h-12 bg-primary flex items-center hover:cursor-pointer hover:opacity-75"
        style="
          z-index: 1000;
          top: 50%;
          left: 100.5%;
          border-radius: 0 1rem 1rem 0;
        "
      >
        <v-icon
          :icon="`mdi-chevron-${showSidebar ? 'left' : 'right'}`"
        ></v-icon>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div class="bg-gray-200 h-full">
        <slot> </slot>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";

interface NavItem {
  title: string;
  value: string;
  path: string;
  icon: string;
}

const showSidebar = ref(true);
const navItems = ref<NavItem[]>([
  { title: "Home", value: "Home", path: "/", icon: "mdi-home" },
  {
    title: "Projects",
    value: "Projects",
    path: "/projects",
    icon: "mdi-folder",
  },
  { title: "About", value: "About", path: "/about", icon: "mdi-information" },
  { title: "Contact", value: "Contact", path: "/contact", icon: "mdi-email" },
]);
</script>
