const express = require('express');
const knex = require('knex');
const crypto = require('crypto');
const axios = require('axios');
const nodemailer = require('nodemailer');
const session = require('express-session')

const app = express();
const port = 3000;


const db = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'crm_local',
  },
});

app.use(session({
  secret: 'your-secret-key', 
  resave: false,
  saveUninitialized: true,
}));




app.get('/login_check', async (req, res) => {
  try {
    const email = 'maayankmalhotra095@gmail.com';
    const password = '1234';

    if (email !== '') {
      const loginArr = await db('member')
        .select('*')
        .where('email', email)
        .where('is_confirmed', 1)
        .where('is_deleted', 0)
        .first();

      if (loginArr) {
        const upassword = loginArr.password;
        const phone = loginArr.mobile;
        const uid = loginArr.id;
        const ipassword = crypto.createHash('md5').update(`henry_${uid}_${password}`).digest('hex');
        console.log(ipassword);

        if (ipassword === upassword) {



          // if (req.ip !== '103.122.169.102') {

          //   const recipients = ['kounal@henryharvin.com', 'ritesh.s@henryharvin.in', 'abhishek@henryharvin.com'];
          //   for (const recipient of recipients) {
          //     await sendUnauthorizedAccessAlert(recipient, email, req.ip);
          //   }

          //   return res.status(403).send('Unauthorized access detected. Please contact the IT department.');
          // }

          const otp = generateRandomOtp();
          console.log(otp);
          const msg = `Your OTP code is ${otp}\nHenryHarvin CRM`;
          const msg2 = `Your OTP code is ${otp}<br>HenryHarvin CRM`;


          // await sendOtpViaWhatsApp(loginArr.whatsapp_number, otp);
          await sendMail(email, "HenryHarvin CRM OTP", `${msg}<br>HenryHarvin CRM`);


          const email2 = 'ritesh.s@henryharvin.in';

          let email3 = email;
          if (email !== 'kounal@henryharvin.com') {
            email3 += ',' + email2;
          }
          if (email === 'gst@henryharvin.com') {
            req.session.henry_login_id = uid;
            req.session.success = '1';
            res.redirect(burl);
            return;
          } else {
            if (email == 'kounal@henryharvin.com' || email == 'kounal@henryharvin.in') {

              sendMail(email, "Kounal Gupta CRM OTP", msg2, 'noreply');

            } else if (email == 'ashwani@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply');

            } else if (email == 'abhishek@henryharvin.com') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'kounal@henryharvin.com,support@henryharvin.com');

            }
            else if (email == 'athif@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'support@henryharvin.com');

            } else if (email == 'sanchayita@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'kounal@henryharvin.com, ,support@henryharvin.com');

            } else if (email == 'vinay@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'kounal@henryharvin.com, support@henryharvin.com');

            } else if (email == 'ghanshyam@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'accounts@henryharvin.in');

            } else if (email == 'accounts@henryharvin.in') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'Ghanshyam@henryharvin.in,kounal@henryharvin.com');

            } else if (email == 'jackie@henryharvin.com' || email == 'mason@henryharvin.com' || email == 'linda@henryharvin.com' || email == 'james@henryharvin.com' || email == 'alex@henryharvin.com' || email == 'andrew@henryharvin.com' || email == 'tefl@henryharvin.com' || email == 'katherine@henryharvin.com' || email == 'maarten@henryharvin.com' || email == 'phil@henryharvin.com' || email == 'ava@henryharvin.com' || email == 'Morgan@henryharvin.com' || email == 'Gary.Cooper@henryharvin.com') {

              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'abhishek@henryharvin.com,support@henryharvin.com,james.miller@henryharvin.com');

            } else if (email == 'toshi@henryharvin.in') {
              sendMail('toshisharma38@gmail.com', "HenryHarvin CRM OTP", msg2, 'noreply', 'ritesh@henryharvin.com');
            } else {
              sendMail(email3, "HenryHarvin CRM OTP", msg2, 'noreply', 'kounal@henryharvin.com, support@henryharvin.com,abhishek@henryharvin.com');

            }

          }
          var data = {
            phone: phone,
            email: email,
            tempId: uid
          };
          
          if (uid === 262 || uid === 286 || uid === 200 || uid === 464 || uid === 36 || uid === 525 || uid === 1414) {
            data.login_verify = uid;
          }
          
          data.verify_otp = require('crypto').createHash('sha1').update(otp.toString()).digest('hex');
          data.votp = otp;
          data.sname = loginArr.name;
          
          req.session.data = data;
          req.session.memberCountry = loginArr.memberCountry;
          


          res.json({ success: true, message: 'Session data set successfully', data: req.session.data });
        } else {
          res.status(400).json({ error: 'Your password is incorrect.' });
        }
      } else {
        res.status(400).json({ error: "That account doesn't exist. Enter a different email id." });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

async function sendUnauthorizedAccessAlert(recipient, email, ipAddress) {
  const subject = 'Alert: Unauthorized Access to CRM';
  const body = `An unauthorized access detected from: ${email}\nIp Address: ${ipAddress}`;


  await sendMail(recipient, subject, body, 'noreply');
}

function generateRandomOtp() {
  return Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
}

async function sendMail(to, subject, body, from = 'noreply') {
  console.log(to);
  console.log(subject);
  const transporter = nodemailer.createTransport({
    host: '0.0.0.0',
    port: 1025,
    ignoreTLS: true,
  });
  const designedMessage = `
    <style>
      @import url("https://fonts.googleapis.com/css?family=Cookie");
      .fallback-font { font-family: Cookie !important; }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <div style="font-family: Muli, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td bgcolor="#431f79" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                    <td align="center" valign="top" style="padding: 20px 10px 20px 10px;">
                      <a href="https://www.henryharvin.com" target="_blank">
                        <img alt="Henry Harvin Education" src="https://www.henryharvin.com/images/logo.png" style="display: block; color: #ffffff; font-size: 18px;" border="0">
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#431f79" align="center" style="padding: 0px 10px 0px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Cookie; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                    <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; color: #666666; font-size: 14px; font-weight: 400; line-height: 25px;">
                      ${body}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;


  const mailOptions = {
    from: 'maayankmalhotra095@gmail.com',
    to,
    subject,
    html: designedMessage,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending mail:', error.message);
  }
}

app.post('/verify_otp', (req, res) => {
  try {
    const uotp = req.body.otp;
    const opt1 = sha1(uotp); 
    const sotp = req.session.verify_otp;

    if (opt1 === sotp) {
      req.session.login_verify = req.session.tempId;
      const renderedRoute = req.session.renderedRoute;

      if (renderedRoute) {
        req.session.renderedRoute = null;
        return res.redirect(renderedRoute);
      }

      return res.redirect('/');
    } else {
      return res.redirect('/verify/otp').json({ error: 'Opps! Wrong OTP' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred.' });
  }
});



app.get('/otp_again', (req, res) => {
  try {
    if (req.session.login_verify) {
      const otp = req.session.votp;
      const email = req.session.email;
      const name = req.session.sname;
      let email2 = '';

      if (email !== 'kounal@henryharvin.com') {
        email2 = 'kounal@henryharvin.com';
      }

      const msg2 = `Your OTP code is ${otp}<br>HenryHarvin CRM`;

      
      sendMailV2(email, 'Henry Harvin OTP', msg2, 'noreply', 'niranjan@henryharvin.com');

     
      return res.redirect('/verify/otp');
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred.' });
  }
});


app.get('/forgotPassword', 
// [
//   check('email').isEmail().exists(),
// ],
 async (req, res) => {
  try {
   // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   return res.status(400).json({ errors: errors.array() });
    // }
    // req.body.email='maayankmalhotra095@gmail.com';
     var email='maayankmalhotra095@gmail.com';
    const token = crypto.randomBytes(32).toString('hex');
    const resetPasswordDetail = {
      email: email,
      token: token,
    };

  
    await db('password_resets').upsert(resetPasswordDetail).where('email',email).orWhere('token', token);

  
    await sendResetPasswordMail(resetPasswordDetail.email,'Reset Password Link', resetPasswordDetail.token);

    return res.json(1);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred.' });
  }
});


// async function sendResetPasswordMail(email, token) {
//   const transporter = nodemailer.createTransport({
    
//     service: 'gmail',
//     auth: {
//       user: 'your_email@gmail.com',
//       pass: 'your_email_password',
//     },
//   });

//   const mailOptions = {
//     from: 'your_email@gmail.com',
//     to: email,
//     subject: 'Password Reset',
//     html: `Click the following link to reset your password: <a href="https://yourwebsite.com/reset-password/${token}">Reset Password</a>`,
//   };

//   await transporter.sendMail(mailOptions);
// }
async function sendResetPasswordMail(to, subject, token, from = 'noreply') {
  console.log(to);
  console.log(subject);
  const transporter = nodemailer.createTransport({
    host: '0.0.0.0',
    port: 1025,
    ignoreTLS: true,
  });
  const designedMessage = `
    <style>
      @import url("https://fonts.googleapis.com/css?family=Cookie");
      .fallback-font { font-family: Cookie !important; }
    </style>
    <link href="https://fonts.googleapis.com/css?family=Cookie" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Muli:200,200i,300,300i,400,400i,600,600i,700,700i,800,800i,900,900i" rel="stylesheet">

    <div style="font-family: Muli, sans-serif;">
      <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tbody>
          <tr>
            <td bgcolor="#431f79" align="center">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                    <td align="center" valign="top" style="padding: 20px 10px 20px 10px;">
                      <a href="https://www.henryharvin.com" target="_blank">
                        <img alt="Henry Harvin Education" src="https://www.henryharvin.com/images/logo.png" style="display: block; color: #ffffff; font-size: 18px;" border="0">
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#431f79" align="center" style="padding: 0px 10px 0px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                    <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: Cookie; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
                <tbody>
                  <tr>
                  <td bgcolor="#ffffff" align="left" style="padding: 0 20px;">
                  <p><strong>Hello!</strong></p>
                  <p>You are receiving this email because we received a password reset request for your account.<p><br>
                  <a href="http://localhost:3000/reset-password?token=${token}&email=${to}" type="button" style="padding: 4px 6px; background: #2d3748; color: white; text-decoration: none;">Reset Password</a><br>
                  <p>This password reset link will expire in 60 minutes.</p><br>
                  <p>If you did not request a password reset, no further action is required.</p><br>

                  <p>Regards,</p>
                  <p>Henry Harvin</p><br>
                  <hr><br>
                  <p>If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into<br> your web browser: <a href="{{route('password.reset', $member->token)}}?email={{$member->email}}">{{route('password.reset', $member->token)}}?email={{$member->email}}</a></p>
                  </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;


  const mailOptions = {
    from: 'maayankmalhotra095@gmail.com',
    to,
    subject,
    html: designedMessage,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully:', info.messageId);
  } catch (error) {
    console.error('Error sending mail:', error.message);
  }
}


app.get('/reset-password', async (req, res) => {
  try {
    const { email, token } = req.query;

    const passwordReset = await db('password_resets')
      .select('*')
      .where({ email, token })
      .first();

    if (!passwordReset) {
      return res.status(404).send("Reset password link expired or invalid!");
    }

    return res.status(200).json({ passwordReset });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});

app.post('/reset-password-store', async (req, res) => {
  try {
    const { email, token, password } = req.body;

    const passwordReset = await db('password_resets')
      .where({ email, token })
      .first();

    if (!passwordReset) {
      return res.status(404).json({ error: 'Reset password link expired or invalid!' });
    }
    const hashedPassword = crypto.createHash('md5').update(`henry_${memberId}_${password}`).digest('hex');

    await db('member')
      .where('email', email)
      .update({
        password: `henry_${password}`,
        hidden_password: hashedPassword,
      });

 
    await db('password_resets')
      .where({ email, token })
      .update({ token: '' });

    return res.status(200).json({ success: true, message: 'Password changed! Login with your new password.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});




// app.get('/test', async (req, res) => {
//   try {


//     const records = await db('lswsheets')
//       .select(
//         'lswsheets.id',
//         'member.name AS m_name',
//         'member.ozonetel_campaign_name AS ozonetel_campaign_name',
//         'member.is_admin AS is_admin'
//       )
//       .modify((queryBuilder) => {
//         if (req.query.shared_leads) {
//           queryBuilder.leftJoin('member', 'member.id', 'lswsheets.member_id');
//         } else if (!req.query.ecomMember && !req.query.shared_leads) {
//           queryBuilder.leftJoin('member', 'member.id', 'lswsheets.member_id');
//         } else if (req.query.ecomMember && !req.query.shared_leads) {
//           queryBuilder.leftJoin('member', 'member.id', 'lswsheets.product_member_id');
//         }
//       })
//       .where('lswsheets.is_deleted', 0)
//       .modify((queryBuilder) => {
//         if (req.query.lswsheet_id) {
//           queryBuilder.where('lswsheets.id', req.query.lswsheet_id);
//         } else {
//           queryBuilder.where('member.id', req.query.u_id);
//         }
//       })
//       .modify((queryBuilder) => {
//         if (req.query.las) {
//           const start = new Date().toISOString().split('T')[0] + ' ' + req.query.las;
//           const end = new Date().toISOString().split('T')[0] + ' ' + req.query.lae;
//           queryBuilder.whereBetween('allocation_time', [start, end]);
//         }
//       })
//       .modify((queryBuilder) => {
//         if (req.query.certificate_status === '1') {
//           queryBuilder.whereExists(function () {
//             this.select('*')
//               .from('certificate_tracker')
//               .whereRaw('certificate_tracker.lswsheet_id = lswsheets.id');
//           });
//         } else if (req.query.certificate_status === '0') {
//           queryBuilder.whereNotExists(function () {
//             this.select('*')
//               .from('certificate_tracker')
//               .whereRaw('certificate_tracker.email = lswsheets.email');
//           });
//         }
//       })

//       .leftJoin('call_detail', 'lswsheets.mobile', 'call_detail.caller_id')
//       .leftJoin('scholarship_form', 'lswsheets.email', 'scholarship_form.email')
//       .leftJoin('bajajforms', 'lswsheets.email', 'bajajforms.email')
//       .leftJoin('eduvanzforms', 'lswsheets.email', 'eduvanzforms.email')
//       .leftJoin('description', 'lswsheets.id', 'description.lid')
//       .leftJoin('payment', 'lswsheets.id', 'payment.lead_id')
//       .leftJoin('member', 'lswsheets.member_id', 'member.id')
//       .whereNotNull('payment.payment_url')

//       .orderBy('lswsheets.allocation_time', 'DESC');


// if (req.query.leadId) {
//   records.where('lswsheets.id', req.query.leadId);
// }

// if (req.query.callCount) {
//   if (req.query.callCount > 0) {
//     records.whereExists(function () {
//       this.select('*')
//         .from('call_detail')
//         .whereRaw('call_detail.caller_id = lswsheets.mobile')
//         .limit(req.query.callCount);
//     });
//   }
// }
// if (Array.isArray(req.query.o_lead_source) && req.query.o_lead_source.length > 0) {
//   const olso = req.query.o_lead_source
//     .filter((ols) => ols !== null && ols !== undefined)
//     .map((ols) => decodeURIComponent(ols));

//   if (olso.length > 0) {
//     records.whereIn('lswsheets.original_lead_sourse', olso);
//   }
// }

// if (Array.isArray(req.query.lead_source) && req.query.lead_source.length > 0) {
//   const lso = req.query.lead_source
//     .filter((ls) => ls !== null && ls !== undefined)
//     .map((ls) => decodeURIComponent(ls));

//   if (lso.length > 0) {
//     records.whereIn('lswsheets.leadsource', lso);
//   }
// }

// if (Array.isArray(req.query.course) && req.query.course.length > 0) {
//   const cou = req.query.course.map((c) => decodeURIComponent(c));
//   records.whereIn('lswsheets.course', cou);
// }
// if (Array.isArray(req.query.leadQ) && req.query.leadQ.length > 0) {
//   const lq = req.query.leadQ.map((l) => decodeURIComponent(l));
//   records.whereIn('lswsheets.lead_quality', lq);
// }
// if (Array.isArray(req.query.product_lead_quality) && req.query.product_lead_quality.length > 0) {
//   const lq = req.query.product_lead_quality.map((l) => decodeURIComponent(l));
//   records.whereIn('lswsheets.product_lead_quality', lq);
// }
// const blankConditions = [
//   { field: 'description', emp: 1 },
//   { field: 'dig', emp: 2 },
//   { field: 'lead_quality', emp: 3 },
//   { field: 'painarea', emp: 4 },
// ];

// if (blankConditions.length > 0) {
//   records = records.where((queryBuilder) => {
//     blankConditions.forEach(({ field, emp }) => {
//       queryBuilder.orWhere(function (query) {
//         query.where(`lswsheets.${field}`, null).orWhere(`lswsheets.${field}`, '');
//       });
//     });
//   });
// }


// if (lcity) {
//   const lci = lcity.map((lc) => decodeURIComponent(lc));
//   records = records.whereIn('lswsheets.city', lci);
// }

// if (pain) {
//   const paina = pain.map((p) => trim(decodeURIComponent(p)));
//   records = records.whereIn('lswsheets.painarea', paina);
// }

// if (ccode) {
//   const concode = ccode.map((code) => trim(decodeURIComponent(code)));
//   records = records.whereIn('lswsheets.countrycode', concode);
// }

// if (valall) {
//   records = records.where((queryBuilder) => {
//     queryBuilder
//       .where('lswsheets.name', 'like', `%${valall}%`)
//       .orWhere('lswsheets.description2', valall)
//       .orWhere('lswsheets.city', valall)
//       .orWhere('lswsheets.id', valall)
//       .orWhere('lswsheets.course', valall)
//       .orWhere('lswsheets.email', 'like', `%${valall}%`)
//       .orWhere('alt_email', 'like', `%${valall}%`)
//       .orWhere('lswsheets.mobile', 'like', `%${valall}%`)
//       .orWhere('alt_mobile', 'like', `%${valall}%`)
//       .orWhere('lswsheets.lead_campaign', 'like', `%${valall}%`);
//   });
// }

// if (all_leads) {
//   records = records.where('lswsheets.leadCountry', all_leads);
// }

// if (esdate) {
//   records = records.where('lswsheets.received_date', '>=', esdate);
// }

// if (eedate) {
//   records = records.where('lswsheets.received_date', '<=', eedate);
// }

// if (request.allocation_s_date) {
//   records = records.where('lswsheets.allocation_time', '>=', request.allocation_s_date);
// }

// if (request.allocation_e_date) {
//   records = records.where('lswsheets.allocation_time', '<=', request.allocation_e_date);
// }

// if (lmsdate) {
//   records = records.where('lswsheets.updated_at', '>=', lmsdate);
// }

// if (lmedate) {
//   records = records.where('lswsheets.updated_at', '<=', lmedate);
// }

// if (camp_filter) {
//   records = records.where('lswsheets.lead_campaign', camp_filter);
// }

// if (followupFrom) {
//   records = records.where('lswsheets.followuptime', '>=', followupFrom);
// }

// if (followupTo) {
//   records = records.where('lswsheets.followuptime', '<=', followupTo);
// }

// if (campaignFrom) {
//   records = records.where('lswsheets.campaign_updated_at', '>=', campaignFrom);
// }

// if (campaignTo) {
//   records = records.where('lswsheets.campaign_updated_at', '<=', campaignTo);
// }



// if (pbd) {
//   pbd.forEach((p) => {
//     if (p === "Pipeline") {
//       records = records.where('lswsheets.pipeline', u_id);
//     }
//     if (p === "Bulk") {
//       records = records.where('lswsheets.is_bulk', 1);
//     }
//     if (p === "Demo") {
//       records = records.where('lswsheets.is_demo', 1);
//     }
//     if (p === "scholar_send") {
//       records = records.where('lswsheets.scholarship_form_send', 1);
//     }
//     if (p === "scholar_approved") {
//       records = records.leftJoin('scholarship_form', 'scholarship_form.lid', 'lswsheets.id')
//         .whereNotNull('scholarship_form.lid');
//     }
//   });
// }


// if (sortby) {
//   if (sortby === 0) {
//     records = records.orderBy('lswsheets.id', 'desc');
//   } else if (sortby === 1 || sortby === 2) {
//     records = records.orderBy('lswsheets.id', 'asc');
//   }
// }
// const courseList = await knex('course')
//   .where('crm_course_id', '!=', '')
//   .where('is_deleted', '0')
//   .orderBy('crm_course_id', 'asc')
//   .select('id', 'crm_course_id', 'course_name');


// const products = await knex('products').select('*');

// const subject = await knex('courses_mailers')
//   .where('courses_id', '=', record.course)
//   .select('subject')
//   .first();

// const emailTemplate = await knex('courses_mailers')
//   .where('courses_id', '=', record.course)
//   .select('body')
//   .first();
//   const cussSuppHis = [];

//   if (cussSupp2) {
//     for (const c_s_2 of cussSupp2) {
//       const cussSuppComments = await knex('customer_support_comments')
//         .where('tid', c_s_2.id)
//         .orderBy('cdate', 'desc')
//         .select('*');

//       for (const c_s_c of cussSuppComments) {
//         if (c_s_c) {
//           const memberName2 = await knex('members')
//             .where('id', c_s_c.added_by)
//             .select('name')
//             .first();

//           const tempn = memberName2 ? memberName2.name : "";
//           const entry = `<span><strong>${c_s_c.cdate} =></strong> ${c_s_c.comment} <strong>(${tempn})</strong></span><br/><br/>`;
//           cussSuppHis.push(entry);
//         } else {
//           const entry = '<span><strong>No Tagging Done.</strong></span><br/><br/>';
//           cussSuppHis.push(entry);
//         }
//       }
//     }
//   }
//     res.json({ success: true, records: records });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, error: 'Internal Server Error' });
//   }
// });




app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
