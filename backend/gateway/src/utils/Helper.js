// src/utils/Helper.js

const jwt = require('jsonwebtoken');


function responseReturn(res,code,status=false,message='',result={}) {
  
  const return_data = {status,message,result};

  if(code === 200){
    return res.json(return_data);
  }else{
    return res.status(code).json(return_data);
  }
  
}

module.exports = {
  responseReturn
};
