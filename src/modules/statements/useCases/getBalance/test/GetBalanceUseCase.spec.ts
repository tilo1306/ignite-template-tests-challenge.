import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../../entities/Statement"
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../../createStatement/ICreateStatementDTO"
import { GetBalanceError } from "../GetBalanceError"
import {GetBalanceUseCase} from "../GetBalanceUseCase"

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase



describe("Get Balance", () => {
    const newUser = {
        name: "Douglas",
        email: "douglas@test.com",
        password: "123456"
    };

    beforeEach( () => {
        inMemoryStatementsRepository = new InMemoryStatementsRepository();
        inMemoryUsersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository,inMemoryUsersRepository)

    })
    it("should be able to show a balance by user id", async () => {
        const user = await createUserUseCase.execute(newUser)

        const newStatement:ICreateStatementDTO ={
            user_id: user.id as string,
            amount: 1000,
            description: "description",
            type: OperationType.DEPOSIT
        }
        await createStatementUseCase.execute(newStatement)

        let balance = await getBalanceUseCase.execute({ user_id: newStatement.user_id as string });

        expect(balance).toHaveProperty("balance")
        expect(balance).toHaveProperty("statement")      
        
    })

  it("should not be able to show a balance with nonexistent user", () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "1234" })
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
})