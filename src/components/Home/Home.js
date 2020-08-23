import React from 'react';
// import { Outlet } from 'react-router-dom';

import NavBar from '../common/NavBar';
import TopBar from '../common/TopBar';

import styles from './Home.css';

export default function Home () {
	return (
		<div>
			<TopBar />
			<NavBar />

			<div className={styles['wrapper']}>
				<div className={styles['container']}>
				<div className={styles['content']}>
					Bharat
				</div>
				</div>
			</div>
		</div>
	);
}
