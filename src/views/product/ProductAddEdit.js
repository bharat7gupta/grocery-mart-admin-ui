import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Button, FormControlLabel, Switch, Checkbox } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { UploadCloud } from 'react-feather';
import BuyingOption from './BuyingOption';
import * as CloudinaryUtils from '../../utils/cloudinaryUtils';
import Toast from '../../components/common/Toast/Toast';
import { marketPlaces } from '../../components/common/config';

const useStyles = makeStyles(() => ({
	content: {
		position: 'absolute',
		width: '840px',
		maxHeight: '95vh',
		overflow: 'scroll',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		background: 'white',
		borderRadius: '4px'
	},
	header: {
		padding: '20px 30px',
		borderBottom: '1px solid #ddd',
		fontWeight: 'bold',
		fontSize: '20px'
	},
	body: {
		padding: '20px 30px'
	},
	footer: {
		display: 'flex',
		justifyContent: 'space-between',
		borderTop: '1px solid #ddd',
		padding: '14px 30px'
	},
	marketPlace: {
		display: 'flex',
	},
	marketPlaceText: {
		fontSize: '18px',
		fontWeight: 'bold',
		marginRight: '16px',
		padding: '9px'
	},
	marketPlaceError: {
		fontSize: '0.9rem',
		color: '#f44336',
		padding: '9px'
	},
	inputField: {
		display: 'block',
		padding: '16px 0'
	},
	uploadButton: {
		cursor: 'pointer',
		background: 'white',
		marginLeft: '8px'
	},
	multiField: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '16px 0',
	},
}));

let formHasError = false;

export default function ProductAddEdit(props) {
	const classes = useStyles();
	const { product, onProductDetailChanged, availableCategories = [], availableBrands = [] } = props;
	const { preferences, categories, brands } = props;
	const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);
	const [validations, setValidations] = useState({});
	const [toastInfo, setToastInfo] = useState({
		showToast: false,
		severity: "",
		message: ""
	});

	const showToast = (severity, message) => {
		setToastInfo({
			showToast: true,
			severity,
			message
		});
	};

	useEffect(() => {
		// initialize cloudinary upload widget
		CloudinaryUtils.createUploadWidget(
			cloudinarySuccessEventCallback,
			cloudinaryErrorEventCallback
		);
	}, []);

	const cloudinarySuccessEventCallback = uploadInfo => {
		if (uploadInfo) {
			onProductDetailChanged({
				productImage: uploadInfo.secure_url
			});

			validateProductImage(uploadInfo.secure_url);

			showToast("success", "Image uploaded successfully");
		}
	};

	const cloudinaryErrorEventCallback = (message) => {
		showToast("error", message || "Something went wrong. Please try again!");
	};

	const handleMarketPlaceChange = (marketPlace, selected) => {
		let marketPlaces;
		const selectedMarketPlaces = product.marketPlaces || [];

		if (selected) {
			marketPlaces = [ ...selectedMarketPlaces, marketPlace.value ];
			onProductDetailChanged({ marketPlaces });
		}
		else {
			marketPlaces = selectedMarketPlaces.filter(m => m !== marketPlace.value);
			onProductDetailChanged({ marketPlaces });
		}

		validateMarketPlaces(marketPlaces);
	};

	const isMarketPlaceSelected = (marketPlace) => {
		const selectedMarketPlaces = product.marketPlaces || [];
		return selectedMarketPlaces.indexOf(marketPlace.value) > -1;
	}

	const shouldEnableWholesaleBuyingOption = () => {
		const selectedMarketPlaces = product.marketPlaces || [];
		const [ retailMarketPlace, ...otherMarketPlaces ] = marketPlaces;
		if (
			selectedMarketPlaces.indexOf(retailMarketPlace) > -1 &&
			!selectedMarketPlaces.some(m => otherMarketPlaces.indexOf(m) > -1)
		) {
			return false;
		}

		return true;
	};

	const handleProductNameChange = (e) => {
		const productName = e.target.value;
		onProductDetailChanged({ productName });
		validateProductName(productName);
	};

	const handleProductCategoryChange = (data, category) => {
		onProductDetailChanged({ category });
		validateProductCategory(category);
	};

	const handleProductBrandChange = (data, brand) => {
		onProductDetailChanged({ brand });
		validateProductBrand(brand);
	};

	const handleImageUpload = () => {
		CloudinaryUtils.openWidget();
	};

	const handleBuyingOptionChanged = (index, buyingOption) => {
		const productBuyingOptions = product.buyingOptions.map((bo, i) => {
			if (i === index) {
				return buyingOption;
			}

			return bo;
		});

		onProductDetailChanged({ buyingOptions: productBuyingOptions });
		validateProductBuyingOptions(productBuyingOptions);
	};

	const handlePrefSelect = (data, preferences) => {
		onProductDetailChanged({ preferences });
	};

	const handleKeywordsChange = (data, keywords) => {
		onProductDetailChanged({ keywords });
	};

	const handleProductDescriptionChange = (e) => {
		onProductDetailChanged({ description: e.target.value });
	};

	const handleKeyFeaturesChange = (e) => {
		onProductDetailChanged({ keyFeatures: e.target.value });
	};

	const handleProductDisclaimerChange = (e) => {
		onProductDetailChanged({ disclaimer: e.target.value });
	};

	// validation functions
	const validateMarketPlaces = (marketPlaces) => {
		let validationMessage = "";

		if (!marketPlaces || marketPlaces.length === 0) {
			validationMessage = "Select at least one marketplace";
			formHasError = true;
		}

		setValidations((prevState) => ({
			...prevState,
			marketPlaces: validationMessage
		}));
	}

	const validateProductName = (productName) => {
		let validationMessage = "";

		if (!productName || productName.trim() === "") {
			validationMessage = "Enter valid product name";
			formHasError = true;
		}

		setValidations((prevState) => ({
			...prevState,
			productName: validationMessage
		}));
	};

	const validateProductCategory = (category) => {
		let validationMessage = "";

		if (!category || category.trim() === "") {
			validationMessage = "Enter valid product category";
			formHasError = true;
		}

		setValidations((prevState) => ({
			...prevState,
			category: validationMessage
		}));
	};

	const validateProductBrand = (brand) => {
		let validationMessage = "";

		if (!brand || brand.trim() === "") {
			validationMessage = "Enter valid product brand";
			formHasError = true;
		}

		setValidations((prevState) => ({
			...prevState,
			brand: validationMessage
		}));
	};

	const validateProductImage = (productImage) => {
		let validationMessage = "";

		if (!productImage || productImage.trim() === "") {
			validationMessage = "error";
			formHasError = true;
		}

		setValidations((prevState) => ({
			...prevState,
			productImage: validationMessage
		}));
	};

	const validateProductBuyingOptions = (buyingOptions) => {
		let buyingOptionsValidation = [];

		for (let i = 0; i < buyingOptions.length; i++) {
			const currentBOValidation = {};
			const currentBuyingOption = buyingOptions[i];

			currentBOValidation.unit = "";
			currentBOValidation.inventory = "";
			currentBOValidation.mrp = "";
			currentBOValidation.offer = "";
			currentBOValidation.price = "";

			if (!currentBuyingOption.unit || currentBuyingOption.unit.trim() === "") {
				currentBOValidation.unit = "Invalid";
				formHasError = true;
			}

			if (!currentBuyingOption.inventory || isNaN(currentBuyingOption.inventory)) {
				currentBOValidation.inventory = "Invalid";
				formHasError = true;
			}

			if (!currentBuyingOption.mrp || isNaN(currentBuyingOption.mrp)) {
				currentBOValidation.mrp = "Invalid";
				formHasError = true;
			}

			if (currentBuyingOption.offer && isNaN(currentBuyingOption.offer)) {
				currentBOValidation.offer = "Invalid";
				formHasError = true;
			}

			if (!currentBuyingOption.price || isNaN(currentBuyingOption.price)) {
				currentBOValidation.price = "Invalid";
				formHasError = true;
			}

			buyingOptionsValidation.push(currentBOValidation);
		}

		setValidations((prevState) => ({
			...prevState,
			buyingOptions: buyingOptionsValidation
		}));
	}


	const validateForm = () => {
		validateMarketPlaces(product.marketPlaces);
		validateProductName(product.productName);
		validateProductCategory(product.category);
		validateProductBrand(product.brand);
		validateProductImage(product.productImage);
		validateProductBuyingOptions(product.buyingOptions);
	}

	const handleProductChanges = () => {
		setSubmitButtonDisabled(true);
		formHasError = false;
		validateForm();

		if (formHasError) {
			setSubmitButtonDisabled(false);
		}
		else {
			try {
				props.onSubmit();
			} catch (e) {
				showToast("error", "Something went wrong. Please try again!");
			}
		}
	};

	const handleProductActiveChange = (event) => {
		onProductDetailChanged({ isActive: event.target.checked });
	};

	return (
		<div className={classes.content}>
			<div className={classes.header}>
				{props.isEditing ? "Edit Product" : "Add Product"}
			</div>

			<div className={classes.body}>
				<div className={classes.marketPlace}>
					<span className={classes.marketPlaceText}>Marketplace: </span>
					{marketPlaces.map((marketPlace) => (
						<FormControlLabel
							key={marketPlace}
							control={
								<Checkbox
									name={`${marketPlace.value}MarketPlace`}
									size="small"
									color="primary"
									checked={isMarketPlaceSelected(marketPlace)}
									onChange={(event) => handleMarketPlaceChange(marketPlace, event.target.checked)}
								/>
							}
							label={marketPlace.text}
							style={{textTransform: 'capitalize'}}
						/>
					))}
					<span className={classes.marketPlaceError}>{validations.marketPlaces}</span>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Product Name *"
						value={product.productName}
						onChange={handleProductNameChange}
						error={!!validations.productName}
						helperText={validations.productName}
					/>
				</div>

				<div className={classes.multiField}>
					<Autocomplete
						size="small"
						id="category-outlined"
						options={categories}
						getOptionLabel={option => option}
						defaultValue=''
						freeSolo
						autoSelect
						value={product.category}
						onChange={handleProductCategoryChange}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								label="Product Category *"
								error={!!validations.category}
								helperText={validations.category}
							/>
						)}
						style={{flexBasis: '49%'}}
						ListboxProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
					/>

					<Autocomplete
						size="small"
						id="brand-outlined"
						options={brands}
						getOptionLabel={option => option}
						defaultValue=''
						freeSolo
						autoSelect
						value={product.brand}
						onChange={handleProductBrandChange}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								label="Brand *"
								error={!!validations.brand}
								helperText={validations.brand}
							/>
						)}
						style={{flexBasis: '49%'}}
						ListboxProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
					/>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						value={product.productImage}
						size="small"
						variant="outlined"
						label="Product Image *"
						error={!!validations.productImage}
						helperText="Click upload button to upload product image"
						InputProps={{
							endAdornment: (
								<UploadCloud
									className={classes.uploadButton}
									onClick={handleImageUpload}
								/>
							)
						}}
					/>
				</div>

				{props.product.buyingOptions.map((buyingOption, index) => (
					<BuyingOption
						hideRemoveOptionButton={props.product.buyingOptions.length === 1}
						value={buyingOption}
						enableWholesale={shouldEnableWholesaleBuyingOption()}
						validation={(validations.buyingOptions && validations.buyingOptions[index]) || {}}
						onBuyingOptionChanged={(buyingOption) => handleBuyingOptionChanged(index, buyingOption)}
						onRemoveBuyingOption={() => props.onRemoveBuyingOption(index)}
					/>
				))}

				<Button color="primary" onClick={props.onAddBuyingOption}>Add Buying Option</Button>

				<br /><br />

				<div className={classes.inputField}>
					<Autocomplete
						multiple
						size="small"
						id="preferences-outlined"
						options={preferences}
						getOptionLabel={(option) => option}
						defaultValue={[]}
						filterSelectedOptions
						freeSolo
						autoSelect
						value={product.preferences}
						onChange={handlePrefSelect}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								label="Preferences"
								placeholder="Chicken small cut, large cut etc"
							/>
						)}
						ListboxProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
					/>
				</div>

				<div className={classes.inputField}>
					<Autocomplete
						multiple
						size="small"
						id="keywords-outlined"
						getOptionLabel={(option) => option}
						options={[]}
						defaultValue={[]}
						freeSolo
						autoSelect
						value={product.keywords}
						onChange={handleKeywordsChange}
						renderInput={(params) => (
							<TextField
								{...params}
								variant="outlined"
								label="Keywords"
								placeholder="Keywords for product search"
							/>
						)}
						ListboxProps={{ style: { maxHeight: 300, overflow: 'auto' } }}
					/>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Key Features"
						multiline
						rows={2}
						value={product.keyFeatures}
						onChange={handleKeyFeaturesChange}
					/>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Description"
						multiline
						rows={2}
						value={product.description}
						onChange={handleProductDescriptionChange}
					/>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Disclaimer"
						multiline
						rows={2}
						value={product.disclaimer}
						onChange={handleProductDisclaimerChange}
					/>
				</div>
			</div>


			<div className={classes.footer}>
				<FormControlLabel
					control={
						<Switch
							checked={product.isActive}
							onChange={handleProductActiveChange}
							name="isActive"
							color="primary"
						/>
					}
					label="Active"
				/>
				<div>
					<Button size="large" variant="contained" style={{ marginRight: '20px' }} onClick={props.onClose}>
						Cancel
					</Button>
					<Button size="large" variant="contained" color="primary" onClick={handleProductChanges} disabled={submitButtonDisabled}>
						{props.isEditing ? "Save Product" : "Add Product"}
					</Button>
				</div>
			</div>

			<Toast {...toastInfo} onClose={() => setToastInfo({ showToast: false })} />
		</div>
	);
}