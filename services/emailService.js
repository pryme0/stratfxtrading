/**
 * @file This file exports methods that are used to send customize emails at different instances e.g forget password,
 *  confirm email
 * @author Joseph <obochi2@gmail.com> <08/09/2020 10:15a>
 * @since 0.1.0
 * Last Modified: JOSEPH<obochi2@gmail.com> <08/09/2020 5:37pm>
 */
const sgMail = require('@sendgrid/mail');
const ejs = require('ejs');
const path = require('path')
const p = require('../views/activate-account.ejs')

// Authorization Token
sgMail.setApiKey(process.env.SENDGRID_KEY);
let poter =path.resolve(path.join(__dirname,'../views/'));



/**
 * @class Mail
 * @classdesc a class responsible for send emails to users
 */
class Mail {
  /**
   * @param {Object} user An object that contains users details including first name
   * @param {String} url A customized url containing an activation token for user email
   */
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = process.env.HOST_FROM;
    this.user = user;
  }
  

  /**
   * @description A static method to send email to user
   * @param {String} template A string representing the type of template to be used
   * @param {String} subject A string representing the subject of the email
   */
  async send(template, subject) {
    try{
        // Render HTML based on a ejs template
    const emailTemplate = await ejs.renderFile(

      `${poter}/${template}.ejs`,
      {
        firstName: this.firstName,
        url: `${this.url}`,
      }
    );
    // Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html: emailTemplate,
    };
    // send email
   let sendM = await sgMail.send(mailOptions);
    return{error:null,message:'mail sent'}
    }catch(err){
        console.log(err.response.body)
    return {error:"error sending mail",message:null};
    }
 
  }

 

  /**
   * @description A static method to send a welcome message after successul signup
   */
  async sendWelcome() {
    await this.send('activate-account', 'Confirm email account');
  }
   /**
   * @description A static method to send a welcome message with reset password link
   */
  async passwordRecovery() {
   let sendPasswordReset = await this.send('password-recovery', 'Password recovery');
   return sendPasswordReset;
  }
}

module.exports = Mail;
