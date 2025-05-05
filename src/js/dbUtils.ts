async function getUserIdByUsername(db: any, userName: string): Promise<number | undefined> {
	const user = await db.Users.findOne({
		where: { user_name: userName },
		attributes: ['id'],
		raw: true,
	})

	return user?.id
}

export { getUserIdByUsername }
