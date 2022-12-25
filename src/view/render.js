export function render (template, node) {
	if (!node) return;
	node.innerHTML = (typeof template === 'function' ? template() : template);
};

