import { Model, ModelStatic } from 'sequelize'

export interface UserAttributes {
	user_name: string
	email: string
	pwd?: string
	salt?: string
}

export interface UserInstance extends Model<UserAttributes>, UserAttributes {}

export interface DB {
	Users: ModelStatic<UserInstance>
	[key: string]: any
}

declare const db: DB
export default db
