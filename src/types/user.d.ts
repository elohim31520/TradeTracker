export interface Admin {
	id: number
	userId: number
	createdAt: Date
	updatedAt: Date
}

export interface UserAttributes {
	name: string
	email: string
	pwd?: string
	salt?: string
}

export interface User {
	id: number
	username: string
	email: string
	createdAt: Date
	updatedAt: Date
}

export interface UserWithAdmin extends User {
	admin: Admin | null
	isAdmin: boolean
} 