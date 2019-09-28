<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <p v-if="$store.state.isUserLoggedIn">
        Logged in as
        <span style="color: #7957d5">{{$store.state.user.email}}.</span>
      </p>
      <p>
        <strong>Countdown</strong> by
        <a href="https://github.com/matassp">Matas</a>. The source code is licensed
        <a href="http://opensource.org/licenses/mit-license.php">MIT</a>. The website content
        is licensed
        <a
          href="http://creativecommons.org/licenses/by-nc-sa/4.0/"
        >CC BY NC SA 4.0</a>.
      </p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
footer {
  background-color: white;
  padding-top: 0;
}
</style>

