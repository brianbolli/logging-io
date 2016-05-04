"use strict";

function FilterManager()
{
	this.filters = {};

};

FilterManager.prototype.addNewFilter = function(name, value, type)
{
	if (!this.filters[name])
	{
		this.filters[name] = {
			container: document.getElementById(name + '-filter'),
			inputs: [],
			values: [],
			active: []
		};
	}

	if (value !== false && this.filters[name].values.indexOf(value) === -1)
	{
		var filter = new FilterHtml(name, value, type);
		var html = filter.getHtml();
		this.filters[name].container.appendChild(html);
		this.filters[name].inputs.push(filter);
		this.filters[name].values.push(value);
	}
};

FilterManager.prototype.parseLogRow = function(row)
{
	this.addNewFilter('client', row.client, 'checkbox');
	this.addNewFilter('instance', row.instance, 'checkbox');
	this.addNewFilter('type', row.type, 'checkbox');
	this.addNewFilter('source', row.source, 'checkbox');
	this.addNewFilter('language', row.language, 'checkbox');
	this.addNewFilter('user_id', row.user_id, 'checkbox');		
};

FilterManager.prototype.updateActives = function(target, value, input)
{

	if ($(input).is(":checked") && this.filters[target].active.indexOf(value) === -1)
	{
		this.filters[target].active.push(value);
	}
	else if (!$(input).is(":checked") && this.filters[target].active.indexOf(value) > -1)
	{
		var remove = false;
		var i = 0;
		while (remove === false)
		{
			if (this.filters[target].active[i] === value)			{
				remove = i;
			}
			else
			{
				i++;
			}
		}
		this.filters[target].active.splice(remove, 1);
	}
	
	this.processFilter(target, this.filters[target].active);
};

FilterManager.prototype.processFilter = function(type, values) {
	$('.log-entry').each(function(){

		var test = $(this).data(type);

		if (values.indexOf(test) > -1 || values.length === 0)
		{
			$(this).show();
		}
		else
		{
			$(this).hide();
		}
	});
};

FilterManager.prototype.isRowVisible = function(ele)
{
	for(var filter in this.filters)
	{
		if (this.filters[filter].active.length > 0)
		{
			var test = $(ele).data(filter);
			if (this.filters[filter].active.indexOf(test) > -1)
			{
				return false;
			}
		}
	}
	
	return true;
};

