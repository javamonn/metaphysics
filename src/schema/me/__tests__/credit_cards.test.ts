/* eslint-disable promise/always-return */
import { runAuthenticatedQuery } from "test/utils"
import gql from "lib/gql"

describe("CreditCards", () => {
  let rootValue: any
  beforeEach(() => {
    const creditCards = [
      { id: "12345", brand: "Visa" },
      { id: "6789", brand: "Mastercard" },
    ]
    rootValue = {
      meCreditCardsLoader: () => Promise.resolve({ body: creditCards }),
    }
  })

  it("returns a credit card connection", () => {
    const query = gql`
      {
        me {
          creditCards(first: 1) {
            edges {
              node {
                id
                brand
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      }
    `

    expect.assertions(1)
    return runAuthenticatedQuery(query, rootValue).then(data => {
      expect(data!.me.creditCards).toEqual({
        edges: [
          {
            node: {
              id: "12345",
              brand: "Visa",
            },
          },
        ],
        pageInfo: {
          hasNextPage: true,
        },
      })
    })
  })
})
