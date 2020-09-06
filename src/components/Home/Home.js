import React, { useState, useEffect, useReducer } from 'react';
import { Modal, TextField, Button } from '@material-ui/core';

import NavBar from '../common/NavBar';
import TopBar from '../common/TopBar';
import FileUpload from '../common/FileUpload/FileUpload';
import { homePageSlots } from '../common/config';
import Toast from '../common/Toast/Toast';
import * as CloudinaryUtils from '../../utils/cloudinaryUtils';
import homePageConfigReducer, { homePageConfigInitialState, HomePageConfigActions } from '../../reducers/homePageConfigReducer';
import './Home.css';

let currentFileUploadKey = "";
const TOAST_AUTO_HIDE_DURATION = 6000;
const URL_REGEX = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
const API_ROOT = "http://localhost:1337";

export default function Home() {
	const [ state, dispatch ] = useReducer(homePageConfigReducer, homePageConfigInitialState);

	const [ bannerIndex, setBannerIndex ] = useState(1);
	const [ showModal, setShowModal ] = useState(false);

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
		fetch(`${API_ROOT}/api/v1/home-page-config/get-all`)
			.then(response => {
				response.json().then(config => {
					dispatch({
						type: HomePageConfigActions.SET_CONFIG,
						data: config.data
					});
				});
			});
	}, []);

	const cloudinarySuccessEventCallback = uploadInfo => {
		dispatch({
			type: HomePageConfigActions.TEMP_SAVE_DRAFT,
			key: currentFileUploadKey,
			data: uploadInfo
		});

		showSuccessToast("Image uploaded successfully");
	};

	const cloudinaryErrorEventCallback = (message) => {
		showErrorToast(message || "Something went wrong. Please try again!");
	};

	const showSuccessToast = (message) => {
		setToastInfo({
			showToast: true,
			severity: "success",
			message
		});

		setTimeout(() => setToastInfo({ showToast: false }), TOAST_AUTO_HIDE_DURATION);
	};

	const showErrorToast = (message) => {
		setToastInfo({
			showToast: true,
			severity: "error",
			message
		});

		setTimeout(() => setToastInfo({ showToast: false }), TOAST_AUTO_HIDE_DURATION);
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
			showErrorToast("Please enter a valid URL");
			return;
		}

		dispatch({
			type: HomePageConfigActions.DELETE_DRAFT,
			key: currentFileUploadKey
		});

		setShowModal(false);

		const requestObj = {
			...imageInfoModalData,
			key: currentFileUploadKey,
			secure_url: state.pageConfigDraft[currentFileUploadKey].secure_url
		};

		fetch(`${API_ROOT}/api/v1/home-page-config/set-config`, {
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

	return (
		<div className="home">
			<TopBar />
			<NavBar />

			<div className="wrapper">
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
							{getFileUploadComponent(homePageSlots.featureProducts)}

							<div className="filler">
								<div className="center-align-hv">
									Show Products here
								</div>
							</div>
						</div>

						<h1>Offer Products</h1>
						<div className="offer-products-container">
							<div className="filler">
								<div className="center-align-hv">
									Show Products here
								</div>
							</div>

							{getFileUploadComponent(homePageSlots.offerProducts)}
						</div>
					</div>
				</div>

				<Toast {...toastInfo} />

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
			</div>
		</div>
	);
}
