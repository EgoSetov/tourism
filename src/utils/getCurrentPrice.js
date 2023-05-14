export const getCurrentPrice = (priceObj) => {
	const month = new Date().getMonth() + 1
	
	switch (month) {
		case 6:
		case 7:
		case 8: 
			return priceObj.summer
			break
		case 12:
		case 1: 
		case 2:
			return priceObj.winter
			break
		default: 
			return priceObj.other
		
	}
} 