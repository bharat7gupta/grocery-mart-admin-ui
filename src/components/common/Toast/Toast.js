import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const TOAST_AUTO_HIDE_DURATION = 6000;

export default function Toast (props) {
	return (
		<Snackbar
			open={props.showToast}
			autoHideDuration={TOAST_AUTO_HIDE_DURATION}
			onClose={props.onClose}
		>
			<Alert severity={props.severity}>
				{props.message}
			</Alert>
		</Snackbar>
	)
}
