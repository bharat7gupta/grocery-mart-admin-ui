const commonApiCall = (apiUrl, method, body) => {
	const requestParams = {};

	return new Promise((resolve, reject) => {
		try {
			const accessToken = localStorage.getItem('token');
	
			requestParams.headers = { token: accessToken };
	
			if (method && method === 'POST') {
				requestParams.method = 'POST';
				requestParams.body = JSON.stringify(body);
			} else {
				requestParams.method = 'GET';
			}
	
			fetch(apiUrl, requestParams)
				.then(response => {
					if (response.status === 401) {
						localStorage.setItem('token', '');
						window.location.href = window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/login';
						return;
					}
			
					response.json().then(json => resolve(json));
				});
		} catch (e) {
			resolve({
				error: true,
				message: 'Something went wrong. Please try again!',
			});
		}
	});
};

export default commonApiCall;
