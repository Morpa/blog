import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'

import Layout from 'components/layout'
import Container from 'components/container'
import Header from 'components/header'
import PostBody from 'components/post-body'
import PostHeader from 'components/post-header'
import PostTitle from 'components/post-title'

import { getPostBySlug, getAllPosts } from 'lib/api'
import { CMS_NAME } from 'lib/constants'
import markdownToHtml from 'lib/markdownToHtml'

import { useFetch } from 'lib/fetcher'

export type Author = {
  name: string
  picture: string
}

export type PostType = {
  slug: string
  title: string
  date: string
  coverImage: string
  author: Author
  excerpt: string
  ogImage: {
    url: string
  }
  content: string
}

type Props = {
  post: PostType
  morePosts: PostType[]
}

const Post = ({ post }: Props) => {
  const router = useRouter()

  if (!router.isFallback && !post?.slug) {
    return <ErrorPage statusCode={404} />
  }

  const { data } = useFetch(`/api/page-views?id=${post.slug}`)

  return (
    <Layout>
      <Container>
        <Header />
        {router.isFallback ? (
          <PostTitle>Loading…</PostTitle>
        ) : (
          <>
            <article className="mb-32">
              <Head>
                <title>
                  {post.title} | Next.js Blog Example with {CMS_NAME}
                </title>
                <meta property="og:image" content={post.ogImage.url} />
              </Head>
              <PostHeader
                title={post.title}
                coverImage={post.coverImage}
                date={post.date}
                author={post.author}
                views={data?.total}
              />
              <PostBody content={post.content} />
            </article>
          </>
        )}
      </Container>
    </Layout>
  )
}

export default Post

type Params = {
  params: {
    slug: string
  }
}

export async function getStaticProps({ params }: Params) {
  const post = getPostBySlug(params.slug, [
    'title',
    'date',
    'slug',
    'author',
    'content',
    'ogImage',
    'coverImage'
  ])
  const content = await markdownToHtml(post.content || '')

  return {
    props: {
      post: {
        ...post,
        content
      }
    }
  }
}

export async function getStaticPaths() {
  const posts = getAllPosts(['slug'])

  return {
    paths: posts.map((posts) => {
      return {
        params: {
          slug: posts.slug
        }
      }
    }),
    fallback: false
  }
}
