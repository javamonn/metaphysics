import Artwork from "./artwork"
import { GraphQLList, GraphQLString } from "graphql"
import config from "config"

const Artworks = {
  type: new GraphQLList(Artwork.type),
  description: "A list of Artworks",
  args: {
    ids: {
      type: new GraphQLList(GraphQLString),
    },
    slugs: {
      type: new GraphQLList(GraphQLString),
      description: `
        Only return artworks matching specified slugs.
        Accepts list of slugs. (e.g. 'andy-warhol', 'banksy')
      `,
    },
  },
  resolve: (
    root,
    options,
    request,
    { rootValue: { artworksLoader, artworkLoader } }
  ) => {
    if (options.slugs) {
      return Promise.all(
        options.slugs.map(slug =>
          artworkLoader(
            slug,
            {},
            {
              requestThrottleMs: config.ARTICLE_REQUEST_THROTTLE_MS,
            }
          )
        )
      )
    }
    return artworksLoader(options)
  },
}

export default Artworks
