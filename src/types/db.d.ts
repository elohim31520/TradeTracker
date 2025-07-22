import { Model, ModelStatic, ModelCtor, Sequelize } from 'sequelize'
import { UserAttributes } from './user'
import { TransactionAttributes, TransactionCreationAttributes } from './transaction'

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}
export interface TransactionInstance
	extends Model<TransactionAttributes, TransactionCreationAttributes>,
		TransactionAttributes {}

export interface DB {
	sequelize: Sequelize
	Sequelize: typeof Sequelize
	Users: ModelStatic<UserInstance>
	Transaction: ModelCtor<TransactionInstance>
	[key: string]: any
}

declare const db: DB
export default db
