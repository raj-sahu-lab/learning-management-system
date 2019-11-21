const CONFIG = require('../../config/config');
const AWS = require('aws-sdk');
const { to, TE } = require('./util.service');
const route53 = new AWS.Route53({ accessKeyId: CONFIG.accessKeyId, secretAccessKey: CONFIG.secretAccessKey, region: CONFIG.bucket}); 
const fs = require("fs");
const { execSync } = require('child_process');

module.exports.createSubDomain = async function(accountName, subDomainName){

  var CallerReference = (new Date().toISOString());
  var params = 
  {
    CallerReference: CallerReference,
    Name: subDomainName,
    HostedZoneConfig: 
    {
      Comment: 'Subdomain name for : ' + accountName,
      PrivateZone: false
    }
  };

  [err , domainData] = await to(route53.createHostedZone(params).promise());
  if (err) TE(err.message);
  if(domainData){
    
    let HostedZoneId = domainData.HostedZone.Id.split("/").pop();
    let NameServers  = domainData.DelegationSet.NameServers;

    var nameServerList = [];
    NameServers.forEach(function(nameServer) {
      nameServerList.push({Value: nameServer});
    });

    var params = 
    {
      ChangeBatch: 
      {
        Changes: 
        [
           {
              Action: "CREATE", 
              ResourceRecordSet: 
              {
                AliasTarget: 
                {
                    DNSName: "dualstack.toa-alb-1739388257.ap-south-1.elb.amazonaws.com", 
                    EvaluateTargetHealth: true, 
                    HostedZoneId: "ZP97RAFLXTNZK" // Do not change it untill the ELB Instance Change
                }, 
                Name: subDomainName, 
                Type: "A", 
              }
          }
        ], 
        Comment: "ELB load balancers for "+ subDomainName
      }, 
      HostedZoneId: HostedZoneId
    };
    [err , recordSet] = await to(route53.changeResourceRecordSets(params).promise());
    if (err) TE(err.message);

    if(recordSet){

      var params = 
      {
          ChangeBatch: 
          {
            Changes: 
            [
                {
                  Action: "CREATE", 
                  ResourceRecordSet: 
                  {
                    Name: subDomainName, 
                    ResourceRecords: nameServerList, 
                    TTL: 60, 
                    Type: "NS"
                  }
                }
            ], 
            Comment: "record Set for "+ subDomainName
          }, 
        HostedZoneId: "Z2KK55G7V9ZHK4"  // Do not change it untill the ELB Instance Change
      };  

      [err , recordSetMainDomain] = await to(route53.changeResourceRecordSets(params).promise());
      if (err) TE(err.message);

    //   var fileCreationPath = "/var/www/webdomains/sites-available/" + subDomainName + ".conf";
    //   var destinationSymbolPath = "/var/www/webdomains/sites-enabled/" + subDomainName + ".conf";
   
    //   let data = "<VirtualHost *:80>\n";
    //      data += "  ServerAdmin webmaster@"+subDomainName+"\n";
    //      data += "  DocumentRoot \"/var/www/html/enterprise_website_live\"\n";
    //      data += "  ServerName "+subDomainName+"\n";
    //      data += "  ErrorLog \"logs/enterpriseerrorlog.log\"\n";
    //      data += "  CustomLog \"logs/enterpriseaccess.log\" comman\n";
    //      data += "</VirtualHost>";
   
         
    //   fs.writeFile(fileCreationPath, data, { flag: 'w+' }, function (err) {
    //      if (err){
   
    //        return err;
   
    //      } else {
   
    //        let command = "ln -s "+fileCreationPath+" " + destinationSymbolPath;  
    //       //  let output = execSync(command);
    //       //  let outputRestart = execSync('sudo apachectl restart');
    //        return 'Perform actions and command are done.';
    //      }
    //  });
      

      return recordSetMainDomain;

    } else {

      return TE('Failed to create record set for domain name');
    }   
  } else {

    return TE('Failed to create domain name');
  }   
}