var objectTree = (function() {
    
    function buildNodeSection(klass, value)
    {
        var span = document.createElement('span');
        span.className = klass;
        span.innerText = value;
        return span;
    }
    
    function buildNodeItem(property, value)
    {
        var _value;
        if (value !== null && typeof value === 'object')
        {
            //value = JSON.stringify(value);
            _value = buildNodeRoot(value);
        }
        else
        {
            var _value = buildNodeSection('property-value', value);    
        }
        
        var li = document.createElement('li');
        var _property = buildNodeSection('object-property', property);
        
        li.appendChild(_property);
        li.appendChild(_value);
        return li;
    }
    
    function buildNodeRoot(rows)
    {
        var length = rows.length;
        var ul = document.createElement('ul');
        ul.className = "object-tree";
       
        for (var property in rows)
        {
            var node = buildNodeItem(property, rows[property]);
            ul.appendChild(node);
        }
        
        return ul;
        
    }
  
    function renderObjectTree(data)
    {
        var html = buildNodeRoot(data);
        return html;
    }
  
    
    return {
        render: renderObjectTree
    };
    
}());
