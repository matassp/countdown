<template>
  <main-panel>
    <template #top>
      
    </template>

    <template #middle>
        <div class="tile is-child box top-box data-box">
        </div>
    </template>

    <template #bottom>
        <div class="tile is-6 is-child box bottom-box login-box">

        </div>
        <div class="tile is-6 is-child box bottom-box register-box">
            
        </div>
    </template>
  </main-panel>
</template>

<script>
import MainPanel from "@/components/MainPanel";
export default {
  components: {
    MainPanel
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    }
  }
};
</script>

<style scoped>

</style>
