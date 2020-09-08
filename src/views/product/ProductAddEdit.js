import React, { useState, useEffect } from 'react';
import { makeStyles, TextField, Button } from '@material-ui/core';
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
    textAlign: 'right',
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
	'Medium cut pieces',
	'Large cut chicken'
];

export default function ProductAddEdit (props) {
	const classes = useStyles();

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
	});

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

	const { product, onProductDetailChanged } = props;

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

	const handleProductChanges = () => {
		console.log(product);
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
					/>
				</div>

				<div className={classes.inputField}>
					<TextField
						fullWidth
						value={product.productImage}
						size="small"
						variant="outlined"
						label="Product Image *"
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
				<Button size="large" variant="contained" style={{marginRight: '20px'}} onClick={props.onClose}>
					Cancel
				</Button>
				<Button size="large" variant="contained" color="primary" onClick={handleProductChanges}>
					{props.isEditing ? "Save Product" : "Add Product"}
				</Button>
			</div>

			<Toast {...toastInfo} onClose={() => setToastInfo({ showToast: false })} />
		</div>
	);
}