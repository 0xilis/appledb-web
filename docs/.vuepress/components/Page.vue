<template>
  <main class="page">
    <div class="theme-default-content">
      <h1>{{ pageTitle }}</h1>
      <template v-for="section in sections" :key="section.title">
        <h2>{{ section.title }}</h2>
        <vueSection :section="section"/>
      </template>
    </div>
  </main>
</template>

<script>
export default {
  data() {
    return {
      pageTitle: '',
      sections: []
    }
  },
  async created() {
    let data = await this.getPageData()
    this.pageTitle = data.title
    this.sections = data.sections
    document.title = this.pageTitle + ' | AppleDB'
  },
  mounted() {
    document.title = this.pageTitle // Yes this needs to be done twice idk why
  },
  methods: {
    getPageData() {
      const routeName = this.$route.name
      const routeParams = Object.keys(this.$route.params).map(x => this.$route.params[x])
      
      return fetch(`/pageData/${routeName}/${routeParams.join(';')}.json`.replace(/\.html/g,''), {
          method: 'GET',
	        headers: { 'Content-Type': 'application/json' }
        }
      )
      .then((response) => response.text())
      .then((response) => JSON.parse(response));
    }
  }
}
</script>