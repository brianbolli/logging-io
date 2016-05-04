"use strict";

function FilterHtml(id, value, type)
{
	this.type = type;
	this.id = id;
	this.value = value;
};
	
FilterHtml.prototype.getHtml = function()
{
	var li = document.createElement('li');

	var div = document.createElement('div');
	div.setAttribute('id', this.id);

	var label = document.createElement('label');

	var input = document.createElement('input');
	input.setAttribute('type', this.type);
	input.setAttribute('data-target', this.id);
	input.setAttribute('class', 'log-filters');
	input.setAttribute('value', this.value);

	var text = document.createTextNode(this.value.charAt(0).toUpperCase() + this.value.slice(1));

	label.appendChild(input);
	label.appendChild(text);
	div.appendChild(label);
	li.appendChild(div);

	return li;		
};