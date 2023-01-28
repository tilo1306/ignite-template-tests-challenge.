import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase


describe("Authenticate User", () => { 

    beforeEach( () => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
    })
    it("should be able to authenticate an user ", async () => {
        const user: ICreateUserDTO ={
            name: "Douglas",
            email: "douglas@test.com",
            password: "123456"
        }

        await createUserUseCase.execute(user)

        const auth = await authenticateUserUseCase.execute({email: user.email,password: user.password})
        
        expect(auth).toHaveProperty("token");
        expect(auth).toHaveProperty("user");
        expect(auth.user).toMatchObject({name: user.name})
        expect(auth.user).toMatchObject({email: user.email})
        expect(auth.user).toHaveProperty('id')
    })

    it("Should not be able to authenticate user incorrect email", ()=> {
        expect( async () => {
            const user: ICreateUserDTO ={
                name: "Douglas",
                email: "douglas@test.com",
                password: "123456"
            }
            await createUserUseCase.execute(user)
    
            await authenticateUserUseCase.execute({email: 'Error',password: user.password}) 
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })

    it("Should not be able to authenticate with incorrect password", ()=> {
        expect( async () => {
            const user: ICreateUserDTO ={
                name: "Douglas",
                email: "douglas@test.com",
                password: "123456"
            }
            await createUserUseCase.execute(user)
    
            await authenticateUserUseCase.execute({email: user.email,password: 'Error'}) 
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    })
})