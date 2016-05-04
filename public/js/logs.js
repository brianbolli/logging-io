

function compare(a,b)
{
  if (a.Timestamp._ < b.Timestamp._)
  {
    return 1;
  }
  
  if (a.Timestamp._ > b.Timestamp._)
  {
    return -1;
  }
  
  return 0;
}

var Logs = function (socket)
{
    this.socket = socket;
    this.tbody = $('#log-table').children('tbody');
	
	//this.rowTemplate = new EJS({url: '/ejs/row.ejs'});
	this.rowTemplate = new EJS({ text: row_template });

    this.show = false;
  
    this.filters = new FilterManager();
};

Logs.prototype.ucfirst = function(str)
{
    return str.charAt(0).toUpperCase() + str.slice(1);       
};

Logs.prototype.getFilterClass = function(target, value)
{
	if (!value.replace)
	{
		return false;
	}
	
    return target + '-' + value.replace(/\s+/g, '-').toLowerCase(); 
};

Logs.prototype.updateFilterCounts = function()
{
    $('.log-filter-count').each(function(i){
        
        var target = $(this).attr('id');
        if (target.length > 0)
        {
            var count = $('tr.' + target).length;
            $(this).text(count);
        }
        
    });
};

Logs.prototype.addRow = function (data, callback)
{
    data = JSON.parse(data);
    
    if (data.meta.data !== false && data.meta.data !== "false")
    {
        this.rows++;
        data.meta.data = this.buildDataModal(this.rows, data.meta.data);
    }

    var row = this.rowTemplate.render({
		klass: '',
        client: data.meta.client,
        instance: data.meta.instance,
        timestamp: this.convertDateTime(data.timestamp),
        type: data.type,
        source: data.meta.source,
        language: data.meta.language,
        user_id: data.meta.user_id,
        msg: data.msg,
        data: data.meta.data
    });
	
	if (!this.filters.isRowVisible(row))
	{
		$(row).hide();
	}
    
    $(this.tbody).prepend(row);

	if (callback)
	{
		callback();
	}
};

Logs.prototype.convertDateTime = function(datetime)
{
    var date = new Date(datetime).toISOString();
    return date;
};

Logs.prototype.parseRows = function (data, callback)
{
	console.log('data -> ', data);
    var length = data.entries.length;
    var html = [];
    var tbody = {
        rows: []
    };
	
	var broken = [];
    
    for (var i = 0; i < length; i++)
    {
        var row = data.entries[i];
        
        if (!row.language_)
        {
            row.language_ = {
                _ : ''
            };
        }
		
		if (!row.client_ || !row.instance_)
		{
			broken.push(row);
		}
		else
		{
			if (row.data_._ !== false)
			{
				row.data_._ = this.buildDataModal(i, row.data_._);
			}
			
			var entry = {
				klass: '',
				client: row.client_._,
				instance: row.instance_._,
				timestamp: this.convertDateTime(row.Timestamp._),
				type: row.level._,
				language: row.language_._,
				source: row.source_._,
				user_id: row.user_id_._,
				msg: row.msg._,
				data: row.data_._
			};
			
			this.filters.parseLogRow(entry);

			tbody.rows.push(entry);
		}

    }
    
	if (broken.length > 0)
	{
		console.log('broken rows -> ', broken.length);
		console.log(broken);
	}
	
	var newHtml = new EJS({ text: tbody_template }).render(tbody);
    $(this.tbody).html(newHtml);
    
	var self = this;
	$(document).on('change', '.log-filters', function(e){
		var target = $(this).data('target');
		var value = $(this).val();
		self.filters.updateActives(target, value, this);
	});
	
    
    this.rows = i;
    
    if (callback)
    {
        callback();
    }
};

Logs.prototype.buildDataModal = function(id, data)
{
    if (typeof data === 'undefined')
    {
        data = false;
    }
    else if (typeof data === 'string')
    {
        data = JSON.parse(data);
    }
    
    var body = objectTree.render(data);

	var modal = new EJS({text: modal_template}).render({
        id: id,
        title: 'Data Object',
        data: body.outerHTML
    });
    
    return modal;
};