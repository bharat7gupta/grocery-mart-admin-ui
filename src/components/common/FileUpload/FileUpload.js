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

	const handleImageUpload = () => {
		props.onUploadClick && props.onUploadClick(props.slot.key);
	};

	return (
		<div className="box" style={getCSS()}>
			{!props.uploadInfo && (
				<div className="multi-action">
					<div className="button" title="Upload" onClick={handleImageUpload}>
						<UploadCloud />
					</div>
				</div>
			)}

			{props.uploadInfo && (
				<div className="multi-action">
					<div className="button" title="Add Info and Confirm" style={{marginRight: '20px'}}>
						<PlusSquare />
					</div>
					<div className="button delete-draft" title="Delete Draft">
						<XSquare />
					</div>
				</div>
			)}
		</div>
	);
}
