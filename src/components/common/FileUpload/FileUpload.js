import React from 'react';
import { UploadCloud } from 'react-feather';
import { PlusSquare } from 'react-feather';
import { XSquare } from 'react-feather';

import './FileUpload.css';

export default function FileUpload(props) {
	const getCSS = () => {
		const { uploadInfo } = props;
		const imageUrl = uploadInfo && uploadInfo.secure_url;
		const backgroundImageCSS = imageUrl && `url(${imageUrl})`;

		return {
			...props.slot.config.styles,
			backgroundImage: backgroundImageCSS
		};
	}

	const handleImageUpload = (e) => {
		e.preventDefault();
		e.stopPropagation();
		props.onUploadClick && props.onUploadClick(props.slot.key);
	};

	const handleAddInfoAndConfirm = (e) => {
		e.preventDefault();
		e.stopPropagation();
		props.onAddInfoAndConfirm && props.onAddInfoAndConfirm(props.slot.key);
	};

	const handleDeleteDraft = (e) => {
		e.preventDefault();
		e.stopPropagation();
		props.onDeleteDraft && props.onDeleteDraft(props.slot.key);
	};

	return (
		<a className="box" style={getCSS()} href={props.uploadInfo && props.uploadInfo.navigatingUrl}>
			{(!props.uploadInfo || props.uploadInfo.changeStatus !== 'DRAFT') && (
				<div className="multi-action">
					<div
						className="button"
						title="Upload"
						onClick={handleImageUpload}
					>
						<UploadCloud />
					</div>
				</div>
			)}

			{props.uploadInfo && props.uploadInfo.changeStatus === 'DRAFT' && (
				<div className="multi-action">
					<div 
						className="button"
						title="Add Info and Confirm"
						style={{marginRight: '20px'}}
						onClick={handleAddInfoAndConfirm}
					>
						<PlusSquare />
					</div>
					<div
						className="button delete-draft"
						title="Delete Draft"
						onClick={handleDeleteDraft}
					>
						<XSquare />
					</div>
				</div>
			)}
		</a>
	);
}
