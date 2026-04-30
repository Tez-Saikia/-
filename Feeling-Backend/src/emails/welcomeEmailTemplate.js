export const welcomeEmailTemplate = ({ username }) => {
  return `
  <!DOCTYPE html>
  <html>
    <body style="margin:0; padding:0; background:#1d1d1d; font-family:Arial, sans-serif; color:#fff;">

      <div style="
        max-width:465px;
        margin:40px auto;
        background:#111;
        padding:40px 30px;
        border-radius:12px;
        color:#fff;
        box-shadow: 0 4px 20px rgba(0,0,0,0.4);
      ">

   <!-- Logo -->
<div style="text-align:center; margin-bottom:25px;">
 <img 
  src="https://res.cloudinary.com/disnhsvts/image/upload/Logo_vyew9f.png"
  alt="Feeling Photography Logo"
  style="width: 110px; height: 110px; display:block; margin:0 auto;"
/>
</div>

        <!-- Heading -->
        <h2 style="
          text-align:center;
          font-weight:500;
          font-size:22px;
          line-height:1.4;
          margin:15px 0 25px 0;
          color:#fff;
        ">
          Welcome to 𝑭𝒆𝒆𝒍𝒊𝒏𝒈 𝑷𝒉𝒐𝒕𝒐𝒈𝒓𝒂𝒑𝒉𝒚, ${username.charAt(0).toUpperCase() + username.slice(1)}!
        </h2>

        <!-- Greeting -->
        <p style="font-size:15px; margin:5px 0 15px 0; line-height:1.5;">
          Hi ${username.charAt(0).toUpperCase() + username.slice(1)},
        </p>

        <!-- Body Text -->
        <p style="font-size:14px; line-height:1.6; margin:10px 0 20px 0;">
          We’re thrilled to have you join our community of photography lovers. Explore breathtaking galleries, discover stunning shots, and even customize your own photoshoot by chatting directly with our team.
        </p>

        <p style="font-size:14px; line-height:1.6; margin:10px 0 25px 0;">
          Your journey starts now — don’t wait to capture and enjoy every moment!
        </p>

     <!-- Get Started Button -->
<div style="text-align:center; margin:20px 0 30px 0;">
  <a 
    href="http://localhost:5173/"
    target="_blank"
    style="
      display:inline-block;
      padding:12px 26px;
      background-color:#ffffff;
      color:#000000;
      text-decoration:none;
      border-radius:6px;
      font-weight:600;
      font-size:14px;
      border:1px solid #ffffff;
      mso-padding-alt:0;
    "
  >
    <span style="color:#000000;">Get Started</span>
  </a>
</div>
        <!-- Footer -->
        <p style="font-size:13px; margin:20px 0 0 0; line-height:1.4; color:#bbb;">
          Happy Clicking,<br/>
          The 𝑭𝒆𝒆𝒍𝒊𝒏𝒈 𝑷𝒉𝒐𝒕𝒐𝒈𝒓𝒂𝒑𝒉𝒚 Team
        </p>

      </div>

    </body>
  </html>
  `;
};
