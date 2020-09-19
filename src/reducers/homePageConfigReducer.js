export const HomePageConfigActions = {
	SET_CONFIG: 'SET_CONFIG',
	TEMP_SAVE_DRAFT: 'TEMP_SAVE_DRAFT',
	DELETE_DRAFT: 'DELETE_DRAFT'
};

export const homePageConfigInitialState = {
	pageConfig: {
		"top-banner-1": null,
		"top-banner-2": null,
		"top-banner-3": null,
		"puzzle-left": null,
		"puzzle-right-top": null,
		"puzzle-right-bottom": null,
		"feature-products": null,
		"offer-products": null
	},
	pageConfigDraft: {}
}

export default function homePageConfigReducer (state, action) {
	switch(action.type) {
		case HomePageConfigActions.SET_CONFIG: {
			return { ...state, pageConfig: action.data };
		}

		case HomePageConfigActions.TEMP_SAVE_DRAFT: {
			return {
				...state,
				pageConfigDraft: {
					...state.pageConfigDraft,
					[action.key]: { ...action.data, changeStatus: 'DRAFT' }
				}
			};
		}

		case HomePageConfigActions.DELETE_DRAFT: {
			return {
				...state,
				pageConfigDraft: {
					...state.pageConfigDraft,
					[action.key]: null
				}
			}
		}

		default:
			throw new Error();
	}
}
