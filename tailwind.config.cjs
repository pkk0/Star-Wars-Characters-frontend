const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			screens: {
				'micro': {'max': '403px'},
			  }
		}
	},

	plugins: []
};

module.exports = config;
