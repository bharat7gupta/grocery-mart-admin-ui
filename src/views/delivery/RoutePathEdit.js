import React from 'react';
import { Chip, makeStyles, Button } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import AddPoint from './AddPoint';

const useStyles = makeStyles(() => ({
	routeLine: {
	  position: 'absolute',
	  top: 0,
	  left: 30,
	  right: 30,
	  bottom: 0,
	  borderLeft: '10px solid #e0e0e0',
	  width: 0,
	},
	item: {
		display: 'flex',
		alignItems: 'center',
		margin: '30px 12px',
		position: 'relative',
		zIndex: 1,
	},
	chip: {
		backgroundColor: 'white',
		marginRight: 10,
		fontSize: 18,
		height: 36,
		borderRadius: 18,
	},
	icon: {
		color: '#b5b5b5',
		cursor: 'pointer',
		marginRight: 4,
	},
}));

const RoutePathEdit = (props) => {
	const classes = useStyles();

	const [ points, setPoints ] = React.useState([]);
	const [ indexToAddAfter, setIndexToAddAfter ] = React.useState();

	React.useEffect(() => {
		setPoints(props.points);
	}, [props.points]);

	const handleAddPointClick = (index) => {
		setIndexToAddAfter(index);
	};

	const handleDeletePointClick = (index) => {
		setPoints([
			...points.slice(0, index),
			...points.slice(index + 1),
		]);
	};

	const handleNewPointAddClick = (index, pointName) => {
		if (points.find(point => point.toLowerCase() === pointName.trim().toLowerCase())) {
			alert('Path point already exists');
			return;
		}

		setIndexToAddAfter(undefined);

		setPoints([
			...points.slice(0, index + 1),
			pointName,
			...points.slice(index + 1),
		]);
	};

	const handleNewPointCancelClick = (index) => {
		setIndexToAddAfter(undefined);
	};

	const handleSaveClick = () => {
		props.onSave(points);
	};

	const handleCancelClick = () => {
		props.onCancel();
	};

	return (
		<>
			<div style={{ position: 'relative'}}>
				{points.map((point, index) => (
					<React.Fragment>
						<div key={point} className={classes.item} style={{ margin: (index === 0) && '0 12px' }}>
							<Chip label={point} variant="outlined" className={classes.chip} />

							{indexToAddAfter === undefined && !props.viewMode && (
								<React.Fragment>
									<AddCircleOutlineIcon className={classes.icon} onClick={() => handleAddPointClick(index)} />
									<DeleteOutlineIcon className={classes.icon} onClick={() => handleDeletePointClick(index)} />
								</React.Fragment>
							)}
						</div>

						{indexToAddAfter !== undefined && index === indexToAddAfter && (
							<AddPoint
								index={indexToAddAfter}
								handleNewPointAddClick={handleNewPointAddClick}
								handleNewPointCancelClick={handleNewPointCancelClick}
							/>
						)}
					</React.Fragment>
				))}

				{points.length === 0 && (
					<AddPoint
						index={0}
						handleNewPointAddClick={handleNewPointAddClick}
						handleNewPointCancelClick={handleNewPointCancelClick}
					/>
				)}

				<div className={classes.routeLine}></div>
			</div>

			{!props.viewMode && (
				<>
					<Button
						variant="contained"
						color="primary"
						onClick={handleSaveClick}
						style={{ margin: '30px 12px 12px', width: 120 }}
					>
						Save
					</Button>

					<Button
						variant="contained"
						onClick={handleCancelClick}
						style={{ margin: '30px 12px 12px' }}
					>
						Cancel
					</Button>
				</>
			)}
		</>
	);
};

export default RoutePathEdit;
