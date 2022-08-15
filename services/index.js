import { request, gql } from 'graphql-request'

const graphqlApi = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export const getPosts = async () => {
  const query = gql`
    query {
      postsConnection {
        edges {
          cursor
          node {
            author {
              bio
              id
              name
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `
  const result = await request(graphqlApi, query)

  return result.postsConnection.edges
}

export const getPostDetails = async (slug) => {
  const query = gql`
    query($slug: String!) {
      post(where: { slug: $slug }) {
        title
        excerpt
        featuredImage {
          url
        }
        author {
          name
          bio
          photo {
            url
          }
        }
        createdAt
        slug
        content {
          raw
        }
        categories {
          name
          slug
        }
      }
    }
  `
  const result = await request(graphqlApi, query, { slug })

  return result.post
}

export const getRecentPosts = async () => {
  const query = gql`
    query() {
      posts(orderBy: createdAt_DESC, last: 3) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `
  const result = await request(graphqlApi, query)

  return result.posts
}

export const getSimilarPosts = async (slug, categories) => {
  const query = gql`
    query($slug: String!, $categories: [String!]) {
      posts(
        where: {
          slug_not: $slug
          AND: { categories_some: { slug_in: $categories } }
        }
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `
  const result = await request(graphqlApi, query, { slug, categories })

  return result.posts
}

export const getCategories = async () => {
  const query = gql`
    query {
      categories {
        name
        slug
      }
    }
  `
  const result = await request(graphqlApi, query)

  return result.categories
}

export const getAdjecentPosts = async (slug, createdAt) => {
  const query = gql`
    query($slug: String!, $createdAt: DateTime!) {
      next: posts(
        where: { slug_not: $slug, AND: { createdAt_gte: $createdAt } }
        first: 1
        orderBy: createdAt_ASC
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
      previous: posts(
        where: { slug_not: $slug, AND: { createdAt_lte: $createdAt } }
        first: 1
        orderBy: createdAt_DESC
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `
  const result = await request(graphqlApi, query, { slug, createdAt })

  return { next: result.next[0], previous: result.previous[0] }
}

export const getComments = async (slug) => {
  const query = gql`
    query($slug: String!) {
      comments(where: { post: { slug: $slug } }) {
        name
        createdAt
        comment
      }
    }
  `
  const result = await request(graphqlApi, query, { slug })

  return result.comments
}

export const submitComment = async (obj) => {
  const result = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(obj),
  })

  return result.json()
}

export const getFeaturedPosts = async () => {
  const query = gql`
    query () {
      posts(where: { featuredPost: true }) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }
  `

  const result = await request(graphqlApi, query)

  return result.posts
}

export const getCategoryPost = async (slug) => {
  const query = gql`
    query($slug: String!) {
      postsConnection(where: { categories_some: { slug: $slug } }) {
        edges {
          node {
            author {
              name
              bio
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `
  const result = await request(graphqlApi, query, { slug })

  // console.log(result)
  return result.postsConnection.edges
}
