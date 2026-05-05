<script setup lang="ts">
defineProps<{
  githubUrl: string;
  backendDocsUrl: string;
  backendHealthUrl: string;
}>();
</script>

<template>
    <footer class="portfolio-footer">
      <div>
        <p class="section-kicker">Portfolio project</p>
        <h2>X-uitter Front-end POC</h2>
        <p>
          A professional proof of concept consuming the deployed X-uitter REST API.
        </p>
      </div>

      <nav class="footer-links" aria-label="Project links">
        <a :href="githubUrl" target="_blank" rel="noreferrer">
          GitHub
        </a>

        <a :href="backendDocsUrl" target="_blank" rel="noreferrer">
          Swagger Docs
        </a>

        <a :href="backendHealthUrl" target="_blank" rel="noreferrer">
          API Health
        </a>
      </nav>
    </footer>
</template>