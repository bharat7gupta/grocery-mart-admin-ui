import React, { useState } from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export default function Toast (props) {
	return (
		<Snackbar open={props.showToast} autoHideDuration={6000}>
			<Alert severity={props.severity}>
				{props.message}
			</Alert>
		</Snackbar>
	)
}
