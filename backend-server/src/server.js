const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;

app.use(cors());

app.get("/", (req, res) => {
  console.log("Request received for root");
  res.send("Express server up and running 🚀");
});

async function fetchGitHubProfile(username) {
  const url = `https://api.github.com/users/${username}`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "node.js",
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!response.ok) {
    throw new Error(`GitHub profile not found: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

app.get("/profile/:username", async (req, res) => {
  const username = req.params.username;

  res.setHeader("Content-Type", "text/html");
  res.setHeader("Transfer-Encoding", "chunked");

  // Stream the header and initial HTML with a loading message
  res.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>GitHub Profile Streaming</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
          }
          .header, .footer {
            background-color: #333;
            color: white;
            padding: 10px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          .loading {
            font-size: 20px;
            text-align: center;
            color: #999;
          }
          .profile {
            display: flex;
            align-items: center;
            margin-top: 20px;
          }
          .profile img {
            border-radius: 50%;
            margin-right: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>GitHub Profile</h1>
        </div>
        <div class="content">
          <div id="profile-container">
            <div class="loading">Loading GitHub Profile...</div>
          </div>
        </div>
  `);

  // Stream the footer and end the response
  res.write(`
        <div class="footer">
          <p>&copy; 2024 GitHub Profile</p>
        </div>
      </body>
    </html>
  `);

  try {
    // Fetch GitHub profile data
    const profileData = await fetchGitHubProfile(username);

    console.log(profileData);

    const profileScript = `
      <script>
        window.onload = function() {
        console.log("Hello testing");
          const profileContainer = document.getElementById('profile-container');
          profileContainer.innerHTML = \`
            <div class="profile">
              <img src="${profileData.avatar_url}" alt="${
      profileData.login
    }" width="100" />
              <div>
                <h2>${profileData.name}</h2>
                <p><strong>Username:</strong> ${profileData.login}</p>
                <p><strong>Location:</strong> ${
                  profileData.location || "N/A"
                }</p>
                <p><strong>Public Repos:</strong> ${
                  profileData.public_repos
                }</p>
                <p><strong>Bio:</strong> ${profileData.bio || "N/A"}</p>
              </div>
            </div>\`;
        };
      </script>
    `;

    // Stream the script to replace the loading message dynamically
    res.write(profileScript);
  } catch (error) {
    // Stream an error message in case fetching the profile fails
    res.write(`
      <script>
        const profileContainer = document.getElementById('profile-container');
        profileContainer.innerHTML = '<p>Error fetching profile data: ${error.message}</p>';
      </script>
    `);
  }

  res.end();
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
