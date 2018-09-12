var htmlDump = (function(){
    var opt = {};
    var splitCase = function(t) { return typeof t != 'string' ? t : t.replace(/([A-Z]|[0-9]+)/g, ' $1'); },
        uniqueKeys = function(m){ var h={}; for (var i=0,len=m.length; i<len; i++) for (var k in m[i]) if (show(k)) h[k] = k; return h; },
        keys = function(o){ var a=[]; for (var k in o) if (show(k)) a.push(k); return a; }
    var tbls = [];

    function val(m) {
        if (m == null) return '';
        if (typeof m == 'number') return num(m);
        if (typeof m == 'string') return str(m);
        if (typeof m == 'boolean') return m ? 'true' : 'false';
        return m.length ? arr(m) : obj(m);
    }
    function num(m) { return m; }
    function str(m){ return m.substr(0,6) == '/Date(' ? dmft(date(m)) : m; }
    function date(s) { return new Date(parseFloat(/Date\(([^)]+)\)/.exec(s)[1])); }
    function pad(d) { return d < 10 ? '0'+d : d; }
    function dmft(d) { return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()); }
    function dmfthm(d) { return d.getFullYear() + '/' + pad(d.getMonth() + 1) + '/' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ":" + pad(d.getMinutes()); }
    function show(k) { return typeof k != 'string' || k.substr(0,2) != '__'; }
    function obj(m) {
        var sb = '';
        for (var k in m) if (show(k)) {
            sb += '<tr><th>' + splitCase(k) + '</th><td>' + val(m[k]) + '</td></tr>';
        }
        return sb ? table() + '<tbody>' + sb + '<tbody></table>' : '';
    }
    function arr(m) {
        if (typeof m[0] == 'string' || typeof m[0] == 'number') {
            var sb = '';
            for (var i=0; i<m.length; i++){
                sb += '<tr><td>' + m[i] + '</td></tr>';
            }
            return sb ? table() + '<tbody>' + sb + '<tbody></table>' : '';
        }
        var id=tbls.length, h=uniqueKeys(m);
        var sb = table() + '<thead><tr>';
        tbls.push(m);
        for (var k in h) sb += '<th>' + splitCase(k) + '</th>';
            sb += '</tr></thead><tbody>' + makeRows(h,m) + '</tbody></table>';
        return sb;
    }

    function table(){ return '<table class="' + (opt.className || 'table table-striped') + '">' }

    function makeRows(h,m) {
        var sb = '';
        for (var r=0,len=m.length; r<len; r++) {
            sb += '<tr>';
            var row = m[r];
            for (var k in h) if (show(k)) sb += '<td>' + val(row[k]) + '</td>';
            sb += '</tr>';
        }  
        return sb;
    }

    return function(obj, optArg) {
        opt = optArg || {};
        return val(obj);
    };
})()

function htmlEncode(str) {
    return (str || '')
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}