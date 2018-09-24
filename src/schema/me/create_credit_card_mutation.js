import { GraphQLNonNull, GraphQLString } from "graphql"
import { mutationWithClientMutationId } from "graphql-relay"
import { formatGravityError } from "lib/gravityErrorHandler"
import { CreditCard, CreditCardMutationType } from "../credit_card"

export default mutationWithClientMutationId({
  name: "CreditCard",
  description: "Create a credit card",
  inputFields: {
    token: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  outputFields: {
    credit_card: {
      type: CreditCard.type,
      deprecationReason: "Favor `creditCardOrError`",
      resolve: result => {
        return result && result.id ? result : null
      },
    },
    creditCardOrError: {
      type: CreditCardMutationType,
      resolve: result => result,
    },
  },
  mutateAndGetPayload: (
    { token },
    request,
    { rootValue: { accessToken, createCreditCardLoader } }
  ) => {
    if (!accessToken) {
      throw new Error("You need to be signed in to perform this action")
    }

    return createCreditCardLoader({ token, provider: "stripe" })
      .then(result => result)
      .catch(error => {
        const formattedErr = formatGravityError(error)
        if (formattedErr) {
          return { ...formattedErr, _type: "GravityMutationError" }
        } else {
          throw new Error(error)
        }
      })
  },
})
