const { MongoClient } = require("mongodb");
const { ObjectId } = require("mongodb");
const { connect, getDb } = require("../config/mongo");
const request = require("supertest");
const { describe, it, expect } = require("@jest/globals");
const app = require("../app");
const { createToken, hashPass, verifyToken } = require("../helpers/auth");
const User = require("../model/user");

let connection;
let db;
let access_token;
let id;
let user;
let user2
let users;

beforeAll(async () => {
    try {
        await connect();
        console.log("success to connect to mongo - testing");
		users = getDb().collection("users");

        user = {
            email: "testing@gmail.com",
            password: hashPass("testing"),
            singlePlayerWin: 0,
            multiPlayerWin: 0
        }

        user2 = {
            email: "testing2@gmail.com",
            password: hashPass("testing"),
            singlePlayerWin: 0,
            multiPlayerWin: 0
        }
  
        const newUser = await users.insertOne(user);
        const newUser2 = await users.insertOne(user2);

    } catch (err) {
        console.log(err);
    }
});

afterAll(async () => {
    await getDb().collection('users').deleteMany()
})

describe("POST /register", function () {
    it("should response with message <username> has been added", async () => {
        const response = await request(app)
        .post('/register')
        .send({
            username: 'felixia',
        	email: "felixia@gmail.com",
        	password: "felix"
        })
        expect(response.status).toBe(201)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('message', expect.any(String))
    });

    it('Email is empty', async() => {

		const response = await request(app)
		.post('/register')
		.send({
            password: 'testing'
        })

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', 'Every field is required')
	})

    it('Password is empty', async() => {

		const response = await request(app)
		.post('/register')
		.send({
            email: 'testing@gmail.com'
        })

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', 'Every field is required')
	})

    it('Email already registered', async() => {

		const response = await request(app)
		.post('/register')
		.send({
            username: 'test',
			email: 'testing@gmail.com',
			password: 'testing'
		})

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', 'Email is not unique')
	})
});

describe("POST /login", function () {
    it("should response with status 200 and return access token", async () => {
        const response = await request(app)
        .post('/login')
        .send({
        	email: "testing@gmail.com",
        	password: "testing"
        })
		access_token = createToken({id: response.body.user._id})

        id = response.body.user._id

        console.log(response.body);
        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('access_token', expect.any(String))
        expect(response.body).toHaveProperty('user', expect.any(Object))
    });

    it('Email is empty', async() => {

		const response = await request(app)
		.post('/login')
		.send({
            password: 'testing'
        })

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', 'Email is required')
	})

    it('Password is empty', async() => {

		const response = await request(app)
		.post('/login')
		.send({
            email: 'testing@gmail.com'
        })

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', 'Password is required')
	})

    it('Email is invalid', async() => {

		const response = await request(app)
		.post('/login')
		.send({
            email: 'toasting@gmail.com',
            password: 'testing'
        })

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message', 'Invalid email/password')
	})
});

describe('GET /users', function(){
    it('should return array of object data', async() => {
		const response = await request(app)
		.get('/users')
        .set('access_token', access_token)

		expect(response.status).toBe(200)
		expect(response.body).toBeInstanceOf(Array)
	})

    it('should return status 401 if there is no access token', async() => {
		const response = await request(app)
		.get('/users')

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message', expect.any(String))
	})

    // it('should return status 500', async() => {
    //     const response = await request(app)
    //     .get('/users' )
    //     .set('access_token', access_token)
 
    //     expect(response.status).toBe(500)
    //     expect(response.body).toHaveProperty('message', expect.any(String))
    // })

    // it('should return status 500', async() => {
    //      // Mock the function or module that may cause an internal server error
    // jest.mock('../path-to-your-module', () => {
    //     throw new Error('Simulated internal server error');
    //   });
    //     const response = await request(app)
    //     .get('/users')
    //     .set('access_token', 'your-access-token');
  
    //   expect(response.status).toBe(500);
    //   expect(response.body).toHaveProperty('message', expect.any(String));
    // });
    
    it('should return status 500', (done) => {
        jest.spyOn(User, 'findAll').mockRejectedValue("Error")
        request(app)
			.get("/users")
            .set('access_token', access_token)
			.then((res) => {
        // expect your response here
				expect(res.status).toBe(500);
				expect(res.body).toStrictEqual({"message": "Internal Server Error"});
				done();
			})
			.catch((err) => {
				done(err);
			});
    })

})

describe('GET /users/:_id', function(){
    it('should return data of a user', async() => {
		const response = await request(app)
		.get('/users/' + id)
        .set('access_token', access_token)

		expect(response.status).toBe(200)
		expect(response.body).toBeInstanceOf(Object)
        expect(response.body).toHaveProperty('email', expect.any(String))
        expect(response.body).toHaveProperty('singlePlayerWin', expect.any(Number))
	})

    it('should return status 401 if there is no access token', async() => {
        console.log(id);
		const response = await request(app)
		.get('/users/' + id)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message', expect.any(String))
	})

    

    it('should return status 401 if there is no user found', async() => {
        const responseLogin = await request(app)
        .post('/login')
        .send({
        	email: "testing2@gmail.com",
        	password: "testing"
        })
        let access_tokenUser2 = createToken({id: responseLogin.body.user._id})

         await users.deleteOne({
            _id: new ObjectId(responseLogin.body.user._id),
        });
		const response = await request(app)
		.get('/users/' + id)
        .set('access_token', access_tokenUser2)

		expect(response.status).toBe(401)
		expect(response.body).toHaveProperty('message', expect.any(String))

	})  
})

describe('PATCH /users/:_id', function() {
    
    it('should return status 200', async() => {
        console.log(id);
        console.log(access_token);
		const response = await request(app)
		.patch('/users/' + id)
        .send({gameType : 'singlePlayerWin'})
        .set('access_token', access_token)

		expect(response.status).toBe(200)
		expect(response.body).toHaveProperty('message', expect.any(String))
		expect(response.body).toHaveProperty('result', expect.any(Object))
	})

    it('should return status 400 if gameType is empty', async() => {
		const response = await request(app)
		.patch('/users/' + id)
        .send({gameType : ''})
        .set('access_token', access_token)

		expect(response.status).toBe(400)
		expect(response.body).toHaveProperty('message', expect.any(String))
	})
})