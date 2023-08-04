const createToastMessage = (variant, message) => {
	return {
		message: message,
		variant: variant,
	};
};

module.exports = { createToastMessage };
