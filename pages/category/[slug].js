import React from 'react'
import { useRouter } from 'next/router'

import { getCategories, getCategoryPost } from '../../services'
import { PostCard } from '../../components/PostCard'
import { Categories } from '../../components/Categories'
import { Loader } from '../../components/Loader'

const CategoryPost = ({ posts }) => {
  const router = useRouter()

  if (router.isFallback) return <Loader />

  return (
    <div className="container mx-auto px-10 mb-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="col-span-1 lg:col-span-8">
          {posts.map((post, index) => (
            <PostCard key={index} post={post.node} />
          ))}
        </div>
        <div className="col-span-1 lg:col-span-4">
          <div className="relative lg:sticky top-8">
            <Categories />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryPost

export async function getStaticPaths() {
  const categories = await getCategories()

  const paths = categories.map((category) => {
    return {
      params: {
        slug: category.slug,
      },
    }
  })

  return {
    paths,
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const posts = await getCategoryPost(params.slug)

  return {
    props: {
      posts,
    },
  }
}
