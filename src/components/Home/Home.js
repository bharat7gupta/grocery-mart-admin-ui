import React from 'react';
import { UploadCloud } from 'react-feather';

import NavBar from '../common/NavBar';
import TopBar from '../common/TopBar';

import './Home.css';

export default function Home() {
  return (
    <div className="home">
      <TopBar />
      <NavBar />

      <div className="wrapper">
        <div className="container">
          <div className="content">
            <div className="box">
              <div className="upload-button">
                <UploadCloud />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
