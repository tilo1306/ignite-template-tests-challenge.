import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../CreateUserUseCase";
import { hash } from 'bcryptjs';
import { CreateUserError } from "../CreateUserError";

let createUserUseCase:CreateUserUseCase
let inMemoryUsersRepository: InMemoryUsersRepository

describe("Create User",()=>{
    beforeEach(()=>{

    })
     inMemoryUsersRepository = new InMemoryUsersRepository();
     createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);

    it("should be able to create a new user", async () => {

        const newUser = {
            name: "Douglas",
            email:"douglas@test.com",
            password: "123456"
        };


        const user = await createUserUseCase.execute(newUser)
        
        expect(user).toHaveProperty('id')
        expect(user).toHaveProperty('email')
        expect(user).toHaveProperty('name')
        expect(user).toHaveProperty('password')
        expect(user.name).toEqual(newUser.name)
        expect(user.email).toEqual(newUser.email)

    })

    it("should not be able to create a user with exists email", async () => {

        const newUser = {
            name: "Douglas",
            email:"douglas@test.com",
            password: "123456"
        };

        await createUserUseCase.execute(newUser)        
        expect(createUserUseCase.execute(newUser)).rejects.toEqual(new CreateUserError())
               
    })
})