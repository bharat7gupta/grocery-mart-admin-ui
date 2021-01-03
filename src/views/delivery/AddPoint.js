import React from 'react';
import { makeStyles, TextField } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles(() => ({
	editRow: {
		position: 'relative',
		margin: '30px 16px',
		zIndex: 1,
		display: 'flex',
		alignItems: 'center',
	},
	editTextField: {
		backgroundColor: 'white',
		width: 300,
	},
	editIcon: {
		fontSize: 30,
		marginBottom: '-20px',
		cursor: 'pointer',
	},
}));

const AddPoint = (props) => {
	const classes = useStyles();

	const [ pointName, setPointName ] = React.useState('');

	const handlePointNameChange = (event) => {
		setPointName(event.target.value);
	};

	const handleAddNewPoint = () => {
		if (pointName && pointName.trim()) {
			props.handleNewPointAddClick(props.index, pointName);
		}
	};

	return (
		<div className={classes.editRow}>
			<TextField
				className={classes.editTextField}
				id="standard-basic"
				label="Name this point"
				value={pointName}
				onChange={handlePointNameChange}
			/>

			<CheckCircleIcon
				className={classes.editIcon}
				style={{ marginLeft: 8, color: '#6fbf73' }}
				onClick={handleAddNewPoint}
			/>

			<CancelIcon
				className={classes.editIcon}
				style={{ marginLeft: 4, color: '#f50057' }}
				onClick={props.handleNewPointCancelClick}
			/>
		</div>
	);
};

export default AddPoint;
