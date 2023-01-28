import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "../ShowUserProfileError";
import { ShowUserProfileUseCase } from "../ShowUserProfileUseCase";


let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;


describe("Show user profile", () => {
    beforeEach(()=> {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
        showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository)
    })

    it("should be able to show user",  async () => {
        const user = await createUserUseCase.execute(
            {
            name: "Douglas",
            email: "douglas@test.com",
            password: "123456"
            })

        const profile = await showUserProfileUseCase.execute(user.id as string)

        expect(profile).toHaveProperty('id')
        expect(profile).toHaveProperty('email')
        expect(profile).toHaveProperty('password')
        expect(profile).toHaveProperty('name')
        })

        it("should be able to show user profile fail",   () => {
               
            expect(async ()=> {
                await showUserProfileUseCase.execute("id_error")
            }).rejects.toBeInstanceOf(ShowUserProfileError)
        })
})