import { GraphQLClient, gql } from 'graphql-request'

const graphqlApi = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export default async function asyncHandler(req, res) {
  const graphQLClient = new GraphQLClient(graphqlApi, {
    headers: {
      authorization: `Bearer ${process.env.NEXT_PUBLIC_GRAPHCMS_TOKEN}`,
    },
  })

  const query = gql`
    mutation(
      $name: String!
      $email: String!
      $comment: String!
      $slug: String!
    ) {
      createComment(
        data: {
          name: $name
          email: $email
          comment: $comment
          post: { connect: { slug: $slug } }
        }
      ) {
        id
      }
    }
  `
  const result = await graphQLClient.request(query, {
    name: req.body.name,
    email: req.body.email,
    comment: req.body.comment,
    slug: req.body.slug,
  })

  return res.status(200).send(result)
}
