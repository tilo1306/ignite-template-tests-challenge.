import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository"
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../CreateStatementUseCase"
import { ICreateStatementDTO } from "../ICreateStatementDTO"
import { OperationType } from '../../../entities/Statement'
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase"
import { CreateStatementError } from "../CreateStatementError"


let createStatementUseCase: CreateStatementUseCase
let createUserUseCase: CreateUserUseCase
let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository

describe("CreateStatement", () => {
    const newUser = {
        name: "Douglas",
        email: "douglas@test.com",
        password: "123456"
    };
    beforeEach(()=>{
        inMemoryStatementsRepository = new InMemoryStatementsRepository()
        inMemoryUsersRepository = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
        createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository,inMemoryStatementsRepository)
    })
    it("should be able to create a new statement", async () => {
        const user = await createUserUseCase.execute(newUser)

        const newStatement:ICreateStatementDTO ={
            user_id: user.id as string,
            amount: 1000,
            description: "description",
            type: OperationType.DEPOSIT
        }
        const statement = await createStatementUseCase.execute(newStatement)

        expect(statement).toHaveProperty("amount")
        expect(statement).toHaveProperty("description")
        expect(statement).toHaveProperty("id")
        expect(statement).toHaveProperty("type")
        expect(statement).toHaveProperty("user_id")
    })

    it("should not be able to create a new statement with nonexistent user", () => {

        expect(async ()=>{
            const newStatement:ICreateStatementDTO ={
                user_id: 'user_id error',
                amount: 1000,
                description: "description",
                type: OperationType.DEPOSIT
            }
            
            await createStatementUseCase.execute(newStatement)

        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
        
    })

    it("should not be able to create a new statement with balance less than amount", () => {

        expect(async ()=>{
            const user = await createUserUseCase.execute(newUser)

            const newStatement:ICreateStatementDTO ={
                user_id: user.id as string,
                amount: 100000,
                description: "description",
                type: OperationType.WITHDRAW
            }
            
            await createStatementUseCase.execute(newStatement)

        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
        
    })
})