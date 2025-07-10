import { Model, ModelStatic } from 'sequelize'

interface UserAttributes {
	user_name: string
	pwd: string
	salt: string
	email: string
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export interface DB {
	Users: ModelStatic<UserInstance>
	[key: string]: any
}

declare const db: DB
export default db
