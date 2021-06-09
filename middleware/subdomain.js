module.exports =  function(req, res, next) {
    console.log(req.subdomains);
    if (!req.subdomains.length || req.subdomains.slice(-1)[0] === 'www') return next();
    // otherwise we have subdomain here
    var subdomain = req.subdomains.slice(-1)[0];
    // keep it
    req.subdomain = subdomain;
    next();
  }
  