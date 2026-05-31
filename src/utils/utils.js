function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function getOtpHtml(otp) {
  return `

    <!DOCTYPE html>

    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
    </head>

    <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:40px 0;">
        <tr>
        <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
        style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

        <tr>
            <td align="center"
            style="background:#2563eb;padding:30px;color:#ffffff;">
            <h1 style="margin:0;font-size:28px;">Verify Your Email</h1>
            </td>
        </tr>

        <tr>
            <td style="padding:40px 30px;color:#333333;">

            <h2 style="margin-top:0;">
                Hello 👋
            </h2>

            <p style="font-size:16px;line-height:1.6;">
                Thank you for registering. Use the OTP below to verify your email address.
            </p>

            <div style="text-align:center;margin:30px 0;">
                <div
                style="
                    display:inline-block;
                    background:#eff6ff;
                    border:2px dashed #2563eb;
                    color:#2563eb;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    padding:16px 28px;
                    border-radius:10px;
                ">
                ${otp}
                </div>
            </div>

            <p style="font-size:15px;color:#555;">
                This OTP is valid for <strong>10 minutes</strong>.
            </p>

            <p style="font-size:15px;color:#555;">
                If you did not request this verification, please ignore this email.
            </p>

            </td>
        </tr>

        <tr>
            <td
            style="
                background:#f8fafc;
                text-align:center;
                padding:20px;
                color:#666;
                font-size:13px;
            ">
            © ${new Date().getFullYear()} advance auth. All rights reserved.
            </td>
        </tr>

        </table>

    </td>
    </tr>


    </table>
    </body>
    </html>
    `;
}

module.exports = {
  generateOtp,
  getOtpHtml,
};
