export const ProductsMapActions = {
	ADD_PRODUCTS: 'ADD_PRODUCTS'
};

export default function productsMapReducer (state, action) {
	switch(action.type) {
		case ProductsMapActions.ADD_PRODUCTS: {
			const products = action.data || [];
			const productsMap = products.reduce((productMap, current) => {
				productMap[current.productId] = current;
				return productMap;
			}, {});

			return ({
				...state,
				...productsMap
			});
		}
	
		default:
			throw new Error();
	}
};
