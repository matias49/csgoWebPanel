var CONFIG = require('../config/config');

/**
 * Headers Object
 * @param {[type]} header [description]
 */
function Headers(header){
    this.userAgent = header['user-agent'];
    this.contentType = header['content-type'];
    this.ip = getIp(header['host']);
}

/**
 * Verify the data can come from CSGO Game by verifying the userAgent and the contentType
 * @return {boolean} True if the data can come from CSGO game, false otherwise
 */
Headers.prototype.isValidCSGO = function(){
    if(this.userAgent === "Valve/Steam HTTP Client 1.0 (730)" && this.contentType === 'application/json'){
        return true;
    }
    return false;
}

/**
 * Verify the IP the data is sent from with the IP stored in the config file
 * @return {boolean} true if both IPs matches, false otherwise
 */
Headers.prototype.isValidIp = function(){
    if(this.ip === CONFIG.IP){
        return true;
    }
    return false;
}

/**
 * Combines all the verification
 * @return {boolean} true if everything is OK, false otherwise
 */
Headers.prototype.isValidGlobal = function(){
    if (this.isValidCSGO() && ((CONFIG.VERIFY_IP === 1 && this.isValidIp()) || CONFIG.VERIFY_IP === 0)){
        return true;
    }
    return false;
}

/**
 * Get the IP from the parameter sent, hoping it comes from the 'host' header.
 * The 'host' header comes with a port (IP:PORT), we remove it.
 * @param  {string} host the 'host' header
 * @return {string}      The IP.
 */
function getIp(host){
    var str = host.split(':');
    return str[0];
}

module.exports = Headers;
