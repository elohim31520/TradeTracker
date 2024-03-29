const data = [
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 04', maxPrice: 70261, maxChange: 0.64 },
	{ symbol: 'DXY', createdAt: '2024-03-27 04', maxPrice: 104.346, maxChange: 0.11 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 06', maxPrice: 70511, maxChange: 1 },
	{ symbol: 'DXY', createdAt: '2024-03-27 06', maxPrice: 104.339, maxChange: 0.1 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 06', maxPrice: 70350, maxChange: 0.76 },
	{ symbol: 'DXY', createdAt: '2024-03-27 06', maxPrice: 104.374, maxChange: 0.13 },
	{ symbol: 'DXY', createdAt: '2024-03-27 07', maxPrice: 104.351, maxChange: 0.11 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 07', maxPrice: 69709, maxChange: -0.15 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 08', maxPrice: 69633, maxChange: -0.26 },
	{ symbol: 'DXY', createdAt: '2024-03-27 08', maxPrice: 104.383, maxChange: 0.14 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-27 09', maxPrice: 70021, maxChange: 0.29 },
	{ symbol: 'DXY', createdAt: '2024-03-27 09', maxPrice: 104.313, maxChange: 0.02 },
	{ symbol: 'DXY', createdAt: '2024-03-28 02', maxPrice: 104.387, maxChange: 0.04 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 02', maxPrice: 69396, maxChange: 0.78 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 02', maxPrice: 69070, maxChange: 0.3 },
	{ symbol: 'DXY', createdAt: '2024-03-28 02', maxPrice: 104.341, maxChange: -0.01 },
	{ symbol: 'DXY', createdAt: '2024-03-28 03', maxPrice: 104.356, maxChange: 0.01 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 03', maxPrice: 69194, maxChange: 0.48 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 04', maxPrice: 69655, maxChange: 1.15 },
	{ symbol: 'DXY', createdAt: '2024-03-28 04', maxPrice: 104.339, maxChange: -0.01 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 06', maxPrice: 70163, maxChange: 1.89 },
	{ symbol: 'DXY', createdAt: '2024-03-28 06', maxPrice: 104.397, maxChange: 0.05 },
	{ symbol: 'DXY', createdAt: '2024-03-28 08', maxPrice: 104.592, maxChange: 0.23 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 08', maxPrice: 70438, maxChange: 2.29 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 08', maxPrice: 70600, maxChange: 2.52 },
	{ symbol: 'DXY', createdAt: '2024-03-28 08', maxPrice: 104.594, maxChange: 0.24 },
	{ symbol: 'BTCUSD', createdAt: '2024-03-28 09', maxPrice: 70577, maxChange: 2.49 },
	{ symbol: 'DXY', createdAt: '2024-03-28 09', maxPrice: 104.715, maxChange: 0.35 },
]

const groupedData = data.reduce((acc, obj) => {

	const existingGroup = acc.find((group) => group[0].createdAt === obj.createdAt)

	if (existingGroup) {
		existingGroup.push(obj)
	} else {
		acc.push([obj])
	}

	return acc
}, [])

console.log(groupedData[1]);
