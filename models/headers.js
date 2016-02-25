var CONFIG = require('../config/config');



function Headers(header){
    this.userAgent = header['user-agent'];
    this.contentType = header['content-type'];
    this.ip = getIp(header['host']);
    //this.ip = header['host'];
}
Headers.prototype.isValidCSGO = function(){
    if(this.userAgent === "Valve/Steam HTTP Client 1.0 (730)" && this.contentType === 'application/json'){
        return true;
    }
    return false;
}

Headers.prototype.isValidIp = function(){
    if(this.ip === CONFIG.IP){
        return true;
    }
    return false;
}

Headers.prototype.isValidGlobal = function(){
    if (this.isValidCSGO() && this.isValidIp()){
        return true;
    }
    return false;
}

function getIp(host){
    var str = host.split(':');
    return str[0];
}

module.exports = Headers;