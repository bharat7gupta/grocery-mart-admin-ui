import React, { useState, useEffect } from 'react';

import NavBar from '../common/NavBar';
import TopBar from '../common/TopBar';
import FileUpload from '../common/FileUpload/FileUpload';
import { homePageSlots } from '../common/config';
import Toast from '../common/Toast/Toast';
import * as CloudinaryUtils from '../../utils/cloudinaryUtils';
import './Home.css';

let currentFileUploadKey = "";
const TOAST_AUTO_HIDE_DURATION = 6000;

export default function Home() {
	const [ bannerIndex, setBannerIndex ] = useState(1);
	const [ fileUploadMap, setFileUploadMap ] = useState({});
	const [ toastInfo, setToastInfo ] = useState({
		showToast: false,
		severity: "",
		message: ""
	});

	useEffect(() => {
		CloudinaryUtils.createUploadWidget(
			cloudinarySuccessEventCallback,
			cloudinaryErrorEventCallback
		);
	}, []);

	const cloudinarySuccessEventCallback = uploadInfo => {
		setFileUploadMap(prevFileUploadMap => ({
			...prevFileUploadMap,
			[currentFileUploadKey]: uploadInfo
		}));

		setToastInfo({
			showToast: true,
			severity: "success",
			message: "Image uploaded successfully"
		});

		setTimeout(() => setToastInfo({ showToast: false }), TOAST_AUTO_HIDE_DURATION);
	};

	const cloudinaryErrorEventCallback = (message) => {
		setToastInfo({
			showToast: true,
			severity: "error",
			message: message || "Something went wrong. Please try again!"
		});

		setTimeout(() => setToastInfo({ showToast: false }), TOAST_AUTO_HIDE_DURATION);
	};

	const handleImageUploadStart = key => {
		currentFileUploadKey = key;
		CloudinaryUtils.openWidget();
	};

	const getFileUploadComponent = slot => {
		const uploadInfo = fileUploadMap[slot.key];

		return (
			<FileUpload
				slot={slot}
				uploadInfo={uploadInfo}
				onUploadClick={handleImageUploadStart}
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
			</div>
		</div>
	);
}
