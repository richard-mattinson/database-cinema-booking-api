const supertest = require("supertest")
const app = require("../../../src/server.js")
const { createCustomer } = require("../../helpers/createCustomer.js")

describe("Customer Endpoint", () => {
    describe("POST /customers/register", () => {
        it("will create a new customer", async () => {
            const request = {
                name: "john",
                phone: "123456",
                email: "john@test.com",
            }

            const response = await supertest(app)
                .post("/customers/register")
                .send(request)

            expect(response.status).toEqual(200)
            expect(response.body.data).not.toEqual(undefined)
            expect(response.body.data.id).not.toEqual(undefined)
            expect(response.body.data.name).toEqual(request.name)
            expect(response.body.data.contact.phone).toEqual(request.phone)
            expect(response.body.data.contact.email).toEqual(request.email)
        })

        it("will return 400 if one of the required fields is missing", async () => {
            const response = await supertest(app).post("/customers/register").send({})

            expect(response.status).toEqual(400)
            expect(response.body).toHaveProperty('error')
        })

        it("will return 409 when attemping to register a customer with an in-use email address", async () => {
            const request = {
                name: "john",
                phone: "123456",
                email: "john@test.com",
            }

            await createCustomer(request.name, request.phone, request.email)

            const response = await supertest(app)
                .post("/customers/register")
                .send(request)

            expect(response.status).toEqual(409)
            expect(response.body).toHaveProperty('error')
        })
    })
})
