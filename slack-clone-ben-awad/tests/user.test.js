const { request } = require("graphql-request");

describe("User Resolvers", () => {
  test("ALL USERS", async () => {
    const QUERY = `
        query {
            allUsers {
              id
              email
              username
            }
          }
        `;

    const res = await request("http://localhost:8080/graphql", QUERY);

    expect(res).toMatchObject({
      allUsers: [],
    });
  });

  test("User Register Mutation", async () => {
    const QUERY = `
      mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
          ok
          errors {
            path
            message
          }
        }
      }
      `;

    const variables = {
      username: "harshith",
      email: "harshith@gmail.com",
      password: "harshith",
    };

    const res = await request(
      "http://localhost:8080/graphql",
      QUERY,
      variables
    );
    expect(res).toMatchObject({
      register: {
        ok: true,
        errors: null,
      },
    });
  });
});
