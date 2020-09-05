let cloudinaryUploadWidget = null;

export const createUploadWidget = (successCallback, errorCallback) => {
	if (cloudinaryUploadWidget) {
		return;
	}

	// create the widget
	cloudinaryUploadWidget = window.cloudinary.createUploadWidget(
		{
		  cloudName: 'dm5xyhl7v',
		  uploadPreset: 'z1sui8qb',
			folder: 'e-vender',
			allowed_formats: ["jpg", "jpeg", "png"]
		},
		(error, result) => {
			if (error) {
				errorCallback(error.statusText);
			}
			else {
				if (result.event === 'queues-end') {
					const file = result.info.files[0];
					if (file.done && !file.failed) {
						successCallback(file.uploadInfo);
					}
				}
			}
		}
	);
};

export const openWidget = () => {
	if (cloudinaryUploadWidget) {
		cloudinaryUploadWidget.open();
		return;
	}

	cloudinaryUploadWidget.open(); // open up the widget after creation
};
