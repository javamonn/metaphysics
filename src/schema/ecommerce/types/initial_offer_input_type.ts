import { GraphQLInputObjectType, GraphQLNonNull, GraphQLID } from "graphql"
import { MoneyInput } from "schema/fields/money"

export const InitialOfferInputType = new GraphQLInputObjectType({
  name: "InitialOfferOrderInput",
  fields: {
    orderId: {
      type: new GraphQLNonNull(GraphQLID),
      description: "ID of order",
    },
    offerPrice: {
      type: MoneyInput,
      description: "Offer price",
    },
  },
})
