import React from 'react';
// import { Outlet } from 'react-router-dom';

import NavBar from '../common/NavBar';
import TopBar from '../common/TopBar';

import './Home.css';

export default function Home () {
	return (
		<div className="home">
			<TopBar />
			<NavBar />

			<div className='wrapper'>
				<div className='container'>
				<div className='content'>
					Bharat
				</div>
				</div>
			</div>
		</div>
	);
}
