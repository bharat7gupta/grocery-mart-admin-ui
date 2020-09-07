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

const units = [
	'g',
	'kg',
	'lt'
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
		const value = e.target.value;

		onProductDetailChanged({
			productName: value
		});
	};

	const handleImageUpload = () => {
		CloudinaryUtils.openWidget();
	};

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
						hideRemoveOptionButton={index === 0}
						data={buyingOption}
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
						options={units}
						getOptionLabel={(option) => option}
						defaultValue={[]}
						filterSelectedOptions
						freeSolo
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
					<TextField
						fullWidth
						size="small"
						variant="outlined"
						label="Keywords (comma separated)"
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
					/>
				</div>
			</div>


			<div className={classes.footer}>
				<Button size="large" variant="contained" style={{marginRight: '20px'}} onClick={props.onClose}>
					Cancel
				</Button>
				<Button size="large" variant="contained" color="primary">
					{props.isEditing ? "Save Product" : "Add Product"}
				</Button>
			</div>

			<Toast {...toastInfo} onClose={() => setToastInfo({ showToast: false })} />
		</div>
	);
}