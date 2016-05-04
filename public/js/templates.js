var row_template =     "<tr class='log-entry' data-client='<%= client %>' data-instance='<%= instance %>'" +
		"data-language='<%= language %>' data-type='<%= type %>' data-userid='<%= user_id %>' data-data='<% (data) ? true : false %>'>" +
	"<td><input type='checkbox' name='delete_me[]' value='' /></td>" +
    "<td><%= client %></td>" +
    "<td><%= instance %></td>" +
    "<td class='timestamp'><%= timestamp %></td>" +
    "<td><%= language %></td>" +
    "<td><%= type %></td>" +
    "<td><%= source %></td>" +
    "<td><%= user_id %></td>" +
    "<td><%= msg %></td>" +
    "<td class='data'><%= data %></td>" +
"</tr>";

var tbody_template = "<% for (var i = 0; i < rows.length; i++) { %>" +
    "<tr class='log-entry' data-client='<%= rows[i].client %>' data-instance='<%= rows[i].instance %>'" +
		"data-language='<%= rows[i].language %>' data-type='<%= rows[i].type %>' data-userid='<%= rows[i].user_id %>' data-data='<% (rows[i].data) ? true : false %>'>" +
			"<td><input type='checkbox' name='delete_me[]' value='' /></td>" +
			"<td><%= rows[i].client %></td>" +
			"<td><%= rows[i].instance %></td>" +
			"<td class='timestamp'><%= rows[i].timestamp %></td>" +
			"<td><%= rows[i].language %></td>" +
			"<td><%= rows[i].type %></td>" +
			"<td><%= rows[i].source %></td>" +
			"<td><%= rows[i].user_id %></td>" +
			"<td><%= rows[i].msg %></td>" +
			"<td class='data'><%= rows[i].data %></td>" +
    "</tr>" +
"<% } %>";

var modal_template = "<button type='button' class='btn btn-primary btn-xs' data-toggle='modal' data-target='#data-<%= id %>'>DATA</button>" +
	"<div class='modal fade' id='data-<%= id %>' tabindex='-1' role='dialog' aria-labelledby='data-<%= id %>-label'>" +
    "<div class='modal-dialog' role='document'>" +
        "<div class='modal-content'>" +
            "<div class='modal-header'>" +
                "<button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>&times;</span></button>" +
                "<h4 id='data-<%= id %>-label' class='modal-title'><%= title %></h4>" +
            "</div>" +
            "<div class='modal-body'>" +
                "<div class='object-container'>" +
                    "<%= data %>" +
                "</div>" +
            "</div>" +
            "<div class='modal-footer'>" +
                "<button type='button' class='btn btn-default' data-dismiss='modal'>Close</button>" +
            "</div>" +
        "</div>" +
    "</div>" +
"</div>";