import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Button, FormControlLabel, Switch } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { UploadCloud } from 'react-feather';
import BuyingOption from './BuyingOption';
import * as CloudinaryUtils from '../../utils/cloudinaryUtils';
import Toast from '../../components/common/Toast/Toast';

const useStyles = makeStyles(() => ({
	content: {
    position: 'absolute',
		width: '720px',
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
  inputField: {
    display: 'block',
    padding: '16px 0'
	},
	groupInput: {
		display: 'flex',
		justifyContent: 'space-between',
		padding: '16px 0'
	},
	miniInput: {
		width: '120px'
	},
	uploadButton: {
		cursor: 'pointer',
    background: 'white',
    marginLeft: '8px'
	}
}));

const preferences = [
	'Small cut chicken',
	'Medium cut chicken',
	'Large cut chicken'
];

export default function ProductAddEdit (props) {
	const classes = useStyles();
	const { product, onProductDetailChanged } = props;
	const [ submitButtonDisabled, setSubmitButtonDisabled ] = useState(false);
	const [didMount, setDidMount] = useState(false)
	const [ validations, setValidations ] = useState({});

	const [ toastInfo, setToastInfo ] = useState({
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

		setDidMount(true);
	}, []);

	useEffect(() => {
		if (didMount) {
			setValidations(getValidationMessages());
		}
	}, [ product ]);

	const cloudinarySuccessEventCallback = uploadInfo => {
		if (uploadInfo) {
			onProductDetailChanged({
				productImage: uploadInfo.secure_url
			});

			showToast("success", "Image uploaded successfully");
		}
	};

	const cloudinaryErrorEventCallback = (message) => {
		showToast("error", message || "Something went wrong. Please try again!");
	};

	const handleProductNameChange = (e) => {
		onProductDetailChanged({ productName: e.target.value });
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
		})

		onProductDetailChanged({ buyingOptions: productBuyingOptions });
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

	const handleProductDisclaimerChange = (e) => {
		onProductDetailChanged({ disclaimer: e.target.value });
	};

	const getValidationMessages = (onSubmit) => {
		let validations = {};

		// product name validation
		if (!product.productName || product.productName.trim() === "") {
			validations.productName = "Enter valid product name";
		}

		// product name validation
		if (onSubmit && (!product.productImage || product.productImage.trim() === "")) {
			validations.productImage = "error"
		}

		// product buying options validation
		if (onSubmit && product.buyingOptions) {
			validations.buyingOptions = [];

			for (let i=0; i<product.buyingOptions.length; i++) {
				const currentBOValidation = {};
				const currentBuyingOption = product.buyingOptions[i];

				if (!currentBuyingOption.unit || currentBuyingOption.unit.trim() === "") {
					currentBOValidation.unit = "Invalid";
				}

				if (!currentBuyingOption.mrp || isNaN(currentBuyingOption.mrp)) {
					currentBOValidation.mrp = "Invalid";
				}

				if (currentBuyingOption.offer && isNaN(currentBuyingOption.offer)) {
					currentBOValidation.offer = "Invalid";
				}

				if (!currentBuyingOption.price || isNaN(currentBuyingOption.price)) {
					currentBOValidation.price = "Invalid";
				}

				validations.buyingOptions.push(currentBOValidation);
			}
		}

		return validations;
	}

	const handleProductChanges = () => {
		setSubmitButtonDisabled(true);
		const currentValidations = getValidationMessages(true);
		setValidations(currentValidations);

		// check if there are validation messages
		let noValidationError = true;
		for (let i=0; i<currentValidations.buyingOptions.length; i++) {
			if (Object.keys(currentValidations.buyingOptions[i]).length > 0) {
				noValidationError = false;
				break;
			}
		}

		// if there are no validation messages, initiate api request
		if (Object.keys(currentValidations).length === 1 && noValidationError) {
			try {
				props.onSubmit();
			} catch(e) {
				showToast("error", "Something went wrong. Please try again!");
			}
		}
		else {
			setSubmitButtonDisabled(false);
		}
	};

	const handleProductActiveChange = (event) => {
		onProductDetailChanged({ isActive: event.target.checked });
	};

	let preferenceOptions = preferences || [];

	for(let i=0; i<product.preferences.length; i++) {
		if (preferences && preferences.indexOf(product.preferences[i]) === -1) {
			preferenceOptions.push(product.preferences[i]);
		}
	}

	return (
		<div className={classes.content}>
			<div className={classes.header}>
				{props.isEditing ? "Edit Product" : "Add Product"}
			</div>

			<div className={classes.body}>
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

				<div className={classes.inputField}>
					<TextField
						fullWidth
						value={product.productImage}
						size="small"
						variant="outlined"
						label="Product Image *"
						error={!!validations.productImage}
						helperText="Click upload button to upload product image"
						InputProps={{endAdornment: (
							<UploadCloud
								className={classes.uploadButton}
								onClick={handleImageUpload}
							/>
						)}}
					/>
				</div>

				{props.product.buyingOptions.map((buyingOption, index) => (
					<BuyingOption
						hideRemoveOptionButton={props.product.buyingOptions.length === 1}
						value={buyingOption}
						validation={(validations.buyingOptions && validations.buyingOptions[index]) || {}}
						onBuyingOptionChanged={(buyingOption) => handleBuyingOptionChanged(index, buyingOption)}
						onRemoveBuyingOption={() => props.onRemoveBuyingOption(index)}
					/>
				))}

				<Button color="primary" onClick={props.onAddBuyingOption}>Add Buying Option</Button>
				
				<br/><br/>

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
					<Button size="large" variant="contained" style={{marginRight: '20px'}} onClick={props.onClose}>
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