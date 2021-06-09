var nodemailer = require('nodemailer');
var Notification  = require('../models/Notification');
var request  = require('request');
exports.sendMail = (to,sub,body)=>{
    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });
      
    let mailDetails = {
        from: 'xyz@gmail.com',
        to: 'abc@gmail.com',
        subject: 'Test mail',
        text: 'Node.js testing mail for GeeksforGeeks'
    };
      
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            console.log('Error Occurs');
        } else {
            console.log('Email sent successfully');
        }
    });    
}
exports.sendNotification = (user_name,type,user_id,token)=>{
    content = ``;
    switch(type){
        case "like":
            content  = `${user_name} like  your posts`;
            break;
        case "save":
            content  = `${user_name} save your posts`;
            break;
        case "view":
            content  = `${user_name} view your posts`;
            break;
    }
    new Notification({
        user_id,
        content,
        type
    }).save((err,noti)=>{
        this.sendFcm(token,noti);
    });
}

exports.sendFcm = function (token,notification){
    request({
        uri: 'https://fcm.googleapis.com/fcm/send',
        body: JSON.stringify({
            "to" : token,
            "notification" : {
                "body" : "thid is body",
                "title":notification.content,
                "type" : notification.type,
            }
           }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization':'key='+process.env.FIREBASE_FCM_KEY
        }
    }, function (error, response) {
        console.log(error,response.body);
        return;
    });
}