module.exports = {
	env: {
		browser: true,
		commonjs: true,
		es2021: true,
	},
	extends: ['standard', 'prettier'],
	overrides: [
		{
			env: {
				node: true,
			},
			files: ['.eslintrc.{js,cjs}'],
			parserOptions: {
				sourceType: 'script',
			},
			rules: {
				indent: 'off',
				'no-tabs': 0,
				'comma-dangle': 0,
			},
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {},
};
