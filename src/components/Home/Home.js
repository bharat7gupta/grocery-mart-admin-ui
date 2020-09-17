import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { Modal, TextField, Button } from '@material-ui/core';

import FileUpload from '../common/FileUpload/FileUpload';
import { homePageSlots, API_ROOT } from '../common/config';
import Toast from '../common/Toast/Toast';
import * as CloudinaryUtils from '../../utils/cloudinaryUtils';
import homePageConfigReducer, { homePageConfigInitialState, HomePageConfigActions } from '../../reducers/homePageConfigReducer';
import productsMapReducer, { ProductsMapActions } from '../../reducers/productsMapReducer';
import ProductPlaceholder from './ProductPlaceholder';
import ProductCard from '../../views/product/ProductListView/ProductCard';
import './Home.css';

let currentFileUploadKey = "";
let currentSection = "";
let sectionIndex = "";
const URL_REGEX = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
const MOST_POPULAR_ITEMS = 16;
const intArray = Array.from(Array(MOST_POPULAR_ITEMS).keys());

export default function Home() {
	const params = useParams();
	const [ state, dispatch ] = useReducer(homePageConfigReducer, homePageConfigInitialState);
	const [ productsState, productDispatch ] = useReducer(productsMapReducer, {});

	const [ bannerIndex, setBannerIndex ] = useState(1);
	const [ showModal, setShowModal ] = useState(false);
	const [ showAddProductModal, setShowAddProductModal ] = useState(false);
	const [ productIdToAdd, setProductIdToAdd ] = useState("");
	const [ productDataMap, setProductDataMap ] = useState(null);

	const [ toastInfo, setToastInfo ] = useState({
		showToast: false,
		severity: "",
		message: ""
	});

	const [ imageInfoModalData, setImageInfoModalData ] = useState({
		navigatingUrl: "",
		altText: ""
	});

	useEffect(() => {
		// initialize cloudinary upload widget
		CloudinaryUtils.createUploadWidget(
			cloudinarySuccessEventCallback,
			cloudinaryErrorEventCallback
		);

		// fetch home page config
		fetch(`${API_ROOT}/api/v1/homepageconfig/get`, {
			method: 'POST',
			body: JSON.stringify({ type: params.type })
		})
			.then(response => {
				response.json().then(config => {
					dispatch({
						type: HomePageConfigActions.SET_CONFIG,
						data: config.data
					});

					const featureProductIds = config.data['feature-products'] || [];
					const mostPopularProductIds = config.data['most-popular-products'] || [];
					const offerProductIds = config.data['offer-products'] || [];
					const productIds = [].concat(featureProductIds, mostPopularProductIds, offerProductIds);

					if (productIds.length > 0) {
						fetch(`${API_ROOT}/api/v1/product/get-by-ids`, {
							method: 'POST',
							body: JSON.stringify({ productIds })
						})
						.then(response => response.json().then(data => {
							productDispatch({
								type: ProductsMapActions.ADD_PRODUCTS,
								data: data.data
							});
						}));
					}
				});
			});
	}, [params.type]);

	const cloudinarySuccessEventCallback = uploadInfo => {
		dispatch({
			type: HomePageConfigActions.TEMP_SAVE_DRAFT,
			key: currentFileUploadKey,
			data: uploadInfo
		});

		showToast("success", "Image uploaded successfully");
	};

	const cloudinaryErrorEventCallback = (message) => {
		showToast("error", message || "Something went wrong. Please try again!");
	};

	const showToast = (severity, message) => {
		setToastInfo({
			showToast: true,
			severity,
			message
		});
	};

	const handleUploadClick = key => {
		currentFileUploadKey = key;
		CloudinaryUtils.openWidget();
	};

	const handleAddInfoAndConfirm = key => {
		currentFileUploadKey = key;
		setShowModal(true);

		setImageInfoModalData({
			navigatingUrl: "",
			altText: ""
		});
	};

	const handleDeleteDraft = key => {
		if (confirm("Are you sure you want to delete this draft?")) {
			dispatch({
				type: HomePageConfigActions.DELETE_DRAFT,
				key
			});
		}
	};

	const getFileUploadComponent = slot => {
		const uploadInfo = state.pageConfigDraft[slot.key] || state.pageConfig[slot.key];

		return (
			<FileUpload
				slot={slot}
				uploadInfo={uploadInfo}
				onUploadClick={handleUploadClick}
				onAddInfoAndConfirm={handleAddInfoAndConfirm}
				onDeleteDraft={handleDeleteDraft}
			/>
		);
	};

	const getDot = index => {
		const classes = index === bannerIndex ? "dot dot-selected" : "dot";

		return (
			<div
				className={classes}
				onClick={() => setBannerIndex(index)}
			>
			</div>
		);
	}

	const getThreeDots = () => {
		return (
			<div className="center-align">
				{getDot(1)}
				{getDot(2)}
				{getDot(3)}
			</div>
		)
	};

	const handleConfirmImage = () => {
		if (!URL_REGEX.test(imageInfoModalData.navigatingUrl)) {
			showToast("error", "Please enter a valid URL");
			return;
		}

		dispatch({
			type: HomePageConfigActions.DELETE_DRAFT,
			key: currentFileUploadKey
		});

		setShowModal(false);

		const requestObj = {
			...imageInfoModalData,
			type: params.type,
			key: currentFileUploadKey,
			secure_url: state.pageConfigDraft[currentFileUploadKey].secure_url
		};

		fetch(`${API_ROOT}/api/v1/homepageconfig/set-config`, {
			method: "POST",
			body: JSON.stringify(requestObj)
		}).then(response => {
			response.json().then(config => {
				dispatch({
					type: HomePageConfigActions.SET_CONFIG,
					data: config.data
				});
			});
		});
	};

	const handleNavigatingUrlChange = (e) => {
		setImageInfoModalData({
			...imageInfoModalData,
			navigatingUrl: e.target.value,
		});
	}

	const handleAltTextChange = (e) => {
		setImageInfoModalData({
			...imageInfoModalData,
			altText: e.target.value
		});
	};

	const handleAddProductClick = (section, index) => {
		currentSection = section;
		sectionIndex = index;
		setShowAddProductModal(true);
	};

	const handleProductToSlotChange = (event) => {
		setProductIdToAdd(event.target.value);
	};

	const handleAddProductToSlot = () => {
		fetch(`${API_ROOT}/api/v1/product/get-by-ids`, {
			method: "POST",
			body: JSON.stringify({ productIds: [productIdToAdd] })
		})
		.then(response => {
			response.json().then(data => {
				if (data.data && data.data.length === 1) {
					showToast("success", "Product found! Updating...");

					let requestObj = {
						type: params.type,
						key: currentSection,
						productId: productIdToAdd
					};

					if (sectionIndex !== "" && sectionIndex !== undefined && !isNaN(sectionIndex)) {
						requestObj.sectionIndex = sectionIndex;
					}

					fetch(`${API_ROOT}/api/v1/homepageconfig/set-config`, {
						method: "POST",
						body: JSON.stringify(requestObj)
					}).then(response => {
						alert("Refreshing page to reflect changes...");
						window.location.reload();
					});
				}
				else {
					showToast("error", "Product not found!");
				}
			})
		})
	};

	const getAddProductModalContent = () => {
		return (
			<div className="modal-content">
				<div className="modal-header">
					<h3>Add Product to Slot</h3>
				</div>

				<div className="modal-body" style={{padding: '80px 30px'}}>
					<TextField
						fullWidth
						variant="outlined"
						label="Product Id"
						value={productIdToAdd}
						onChange={handleProductToSlotChange}
					/>
				</div>

				<div className="modal-footer">
					<Button size="large" variant="contained" color="primary" onClick={handleAddProductToSlot}>
						CONFIRM
					</Button>
				</div>
			</div>
		)
	}

	const getModalContent = () => {
		return (
			<div className="modal-content">
				<div className="modal-header">
					Set info for: <b>{currentFileUploadKey}</b>
				</div>

				<div className="modal-body">
					<div className="input-field">
						<TextField
							fullWidth
							variant="outlined"
							label="Url to navigate to *"
							value={imageInfoModalData.navigatingUrl}
							onChange={handleNavigatingUrlChange}
							error={imageInfoModalData.navigatingUrl && !URL_REGEX.test(imageInfoModalData.navigatingUrl)}
						/>
					</div>

					<div className="input-field">
						<TextField
							fullWidth
							variant="outlined"
							label="Image alt text"
							value={imageInfoModalData.altText}
							onChange={handleAltTextChange}
						/>
					</div>
				</div>

				<div className="modal-footer">
					<Button size="large" variant="contained" color="primary" onClick={handleConfirmImage}>
						CONFIRM
					</Button>
				</div>
			</div>
		);
	};

	const getProductView = (index, section) => {
		const productsBySection = state.pageConfig[section];

		if (productsState && Object.keys(productsState).length > 0 && productsBySection && index < productsBySection.length) {
			const productId = productsBySection[index];

			return (
				<div className="product-card-container">
					<ProductCard
						product={productsState[productId]}
						className="product-card"
					/>
					<div className="product-overlay">
						<Button
							color="primary"
							onClick={() => handleAddProductClick(section, index)}
							className="change-product"
						>
							Change Product
						</Button>
					</div>
				</div>
			)
		}
		else {
			return (
				<ProductPlaceholder onAddProduct={() => handleAddProductClick(section)} />
			)
		}
	};

	return (
		<div className="container">
			<div className="content">
				{getFileUploadComponent(homePageSlots[`topBanner${bannerIndex}`])}

				{getThreeDots()}

				<div className="puzzle-section">
					<div className="puzzle-left-section">
						{getFileUploadComponent(homePageSlots.puzzleLeft)}
					</div>
					<div className="puzzle-right-section">
						{getFileUploadComponent(homePageSlots.puzzleRightTop)}
						{getFileUploadComponent(homePageSlots.puzzleRightBottom)}
					</div>
				</div>

				<h1>Feature Products</h1>
				<div className="feature-products-container">
					{getFileUploadComponent(homePageSlots.featureBanner)}

					<div className="filler">
						<div className="filler-row">
							{getProductView(0, "feature-products")}
							{getProductView(1, "feature-products")}
							{getProductView(2, "feature-products")}
						</div>

						<div className="filler-row">
							{getProductView(3, "feature-products")}
							{getProductView(4, "feature-products")}
							{getProductView(5, "feature-products")}
						</div>
					</div>
				</div>

				<h1>Most Popular Products</h1>
				<div className="most-popular">
					{intArray.map(i => getProductView(i, "most-popular-products"))}
				</div>

				<h1>Offer Products</h1>
				<div className="offer-products-container">
					<div className="filler">
						<div className="filler-row">
							{getProductView(0, "offer-products")}
							{getProductView(1, "offer-products")}
							{getProductView(2, "offer-products")}
						</div>

						<div className="filler-row">
							{getProductView(3, "offer-products")}
							{getProductView(4, "offer-products")}
							{getProductView(5, "offer-products")}
						</div>
					</div>

					{getFileUploadComponent(homePageSlots.offerBanner)}
				</div>
			</div>

			<Toast {...toastInfo} onClose={() => setToastInfo({ showToast: false })} />

			<Modal
				open={showModal}
				onClose={() => {}}
				onBackdropClick={() => setShowModal(false)}
				onEscapeKeyDown={() => setShowModal(false)}
				disableEnforceFocus
				disableAutoFocus
			>
				{getModalContent()}
			</Modal>

			<Modal
				open={showAddProductModal}
				onClose={() => setShowAddProductModal(false)}
				onBackdropClick={() => setShowAddProductModal(false)}
				onEscapeKeyDown={() => setShowAddProductModal(false)}
				disableEnforceFocus
				disableAutoFocus
			>
				{getAddProductModalContent()}
			</Modal>
		</div>
	);
}
