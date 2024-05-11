<template>
  <v-layout>
    <v-app-bar title="Jestruvec web site" color="primary" />

    <v-navigation-drawer v-model="showSidebar" elevation="10" permanent>
      <div>
        <RouterLink
          v-for="(item, itemIdx) in navItems"
          :key="itemIdx"
          :to="item.path"
        >
          <div class="flex items-center pa-4 hover:bg-gray-100">
            <v-icon :icon="item.icon" class="mr-2" color="primary" />
            <span>{{ item.title }}</span>
          </div>
        </RouterLink>
      </div>

      <div
        @click="showSidebar = !showSidebar"
        class="absolute w-3 h-12 bg-primary flex items-center hover:cursor-pointer hover:opacity-75"
        style="
          z-index: 1000;
          top: 50%;
          left: 100.5%;
          border-radius: 0 1rem 1rem 0;
        "
      >
        <v-icon
          :icon="`mdi-chevron-${showSidebar ? 'left' : 'right'}`"
          size="12"
        ></v-icon>
      </div>
    </v-navigation-drawer>

    <v-main>
      <div class="bg-gray-200 h-full pa-4">
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
  { title: "Home", value: "Home", path: "/", icon: "mdi-home-outline" },
  {
    title: "Projects",
    value: "Projects",
    path: "/projects",
    icon: "mdi-folder-outline",
  },
  {
    title: "About",
    value: "About",
    path: "/about",
    icon: "mdi-information-outline",
  },
  {
    title: "Contact",
    value: "Contact",
    path: "/contact",
    icon: "mdi-email-outline",
  },
]);
</script>
