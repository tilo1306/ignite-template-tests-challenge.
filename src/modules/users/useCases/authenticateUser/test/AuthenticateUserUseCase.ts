import { CreateUserUseCase } from "../../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase"
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { ICreateUserDTO } from "../../createUser/ICreateUserDTO"

let authenticateUserInMemory:InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User",()=>{
    beforeEach(()=>{
        authenticateUserInMemory = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(authenticateUserInMemory);
        createUserUseCase = new CreateUserUseCase(authenticateUserInMemory);
        
    })


    it("Should be able to authenticate an user",async ()=>{

        const user: ICreateUserDTO = {
            name: "Douglas",
            email:"douglas@test.com",
            password: "123456"
        };

        await createUserUseCase.execute(user);

        const auth = await authenticateUserUseCase.execute({ email: user.email,password: user.password})

        console.log(auth);
    })
})