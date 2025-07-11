export interface Admin {
	id: number
	userId: number
	createdAt: Date
	updatedAt: Date
}

export interface User {
	id: number
	userId: number
	username: string
	email: string
	createdAt: Date
	updatedAt: Date
}

export interface UserWithAdmin extends User {
	admin: Admin | null
	isAdmin: boolean
} 