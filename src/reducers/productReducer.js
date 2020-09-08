export const ProductActions = {
	INIT: 'INIT',
	RESET: 'RESET',
	PRODUCT_DETAIL_CHANGE: 'PRODUCT_DETAIL_CHANGE',
	ADD_BUYING_OPTION: 'ADD_BUYING_OPTION',
	REMOVE_BUYING_OPTION: 'REMOVE_BUYING_OPTION'
}

const buyingOptionInitialState = {
	isWholesale: false,
	unit: "",
	mrp: "",
	offer: "",
	price: ""
};

export const productInitialState = {
	productName: '',
	productImage: '',
	buyingOptions: [
		buyingOptionInitialState
	],
	preferences: [],
	keywords: [],
	description: "",
	disclaimer: ""
}

export default function productReducer (state, action) {
	switch (action.type) {
		case ProductActions.INIT: {
			return action.data;
		}
		
		case ProductActions.RESET: {
			return productInitialState;
		}

		case ProductActions.ADD_BUYING_OPTION: {
			return {
				...state, 
				buyingOptions: [ ...state.buyingOptions, buyingOptionInitialState ]
			}
		}

		case ProductActions.REMOVE_BUYING_OPTION: {
			return {
				...state,
				buyingOptions: state.buyingOptions.filter((o, i) => i !== action.index)
			}
		}

		case ProductActions.PRODUCT_DETAIL_CHANGE: {
			return {
				...state,
				...action.data
			}
		}
	}
}
