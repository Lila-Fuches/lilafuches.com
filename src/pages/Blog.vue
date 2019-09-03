<template>
  <Layout>
    <div class="container-inner mx-auto py-16">

      <template v-if="$page.posts.edges.length >= 1">
        <div v-for="post in $page.posts.edges" :key="post.id" class="post border-gray-400 border-b mb-12">
          <h2 class="text-3xl font-bold"><g-link :to="post.node.path" class="text-copy-primary">{{ post.node.title }}</g-link></h2>
          <div class="text-copy-secondary mb-4">
            <span>{{ post.node.date }}</span>
            <span> &middot; </span>
            <span>{{ post.node.timeToRead }} min read</span>
          </div>

          <div class="text-lg mb-4">
            {{ post.node.summary }}
          </div>

          <div class="mb-8">
            <g-link :to="post.node.path" class="font-bold uppercase">Read More</g-link>
          </div>
        </div> <!-- end post -->

        <pagination-posts
          v-if="$page.posts.pageInfo.totalPages > 1"
          base="/blog"
          :totalPages="$page.posts.pageInfo.totalPages"
          :currentPage="$page.posts.pageInfo.currentPage"
        />
      </template>
      <template v-else>
        <div class="container-inner mx-auto py-16">
          <h2 class="text-4xl font-bold mb-16">
            The blog seems to be empty, check back soon!
          </h2>
        </div>
      </template>
    </div>
  </Layout>
</template>

<page-query>
query Posts ($page: Int) {
  posts: allPost (sortBy: "date", order: DESC, perPage: 3, page: $page) @paginate {
    totalCount
    pageInfo {
      totalPages
      currentPage
    }
    edges {
      node {
        id
        title
        date (format: "MMMM D, Y")
        summary
        timeToRead
        path
      }
    }
  }
}
</page-query>

<script>
import PaginationPosts from '../components/PaginationPosts'

export default {
  metaInfo: {
    title: 'Blog Posts',
    meta: [
      {
        key: 'og:title',
        name: 'og:title',
        content: 'Lila Fuches - blog',
      },
      {
        key: 'twitter:title',
        name: 'twitter:title',
        content: 'Lila Fuches - blog',
      },
    ]
  },
  components: {
    PaginationPosts
  }
}
</script>

