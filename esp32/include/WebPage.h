const char* webpage = R"html(
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KittyPlant WiFi Setup</title>
  <meta name=""description" content="Połącz się ze swoim urządzeniem KittyPlant" />
  <style>
    body
{
    margin: 0;
    background-color: #FAA3AD;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: "Antonio", sans-serif;
    font-style: light;
  
}

.header {
    background-color: #7AA081;
    color: white;
    padding: 20px 30px;
    border-radius: 20px 20px 20px 20px;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    text-align: center;
  }

  .form-container {
    background-color: #FAF3E8;
    padding: 30px 20px;
    border-radius: 20px;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
    margin-top: 20px;
    width: 90%;
    max-width: 350px;
    font-size: 20px;
  }

  label {
    display: block;
    margin-bottom: 5px;
    color: #000;
  }

  input[type="text"], input[type="password"] {
    width: 95%;
    padding: 10px;
    margin-bottom: 20px;
    border: none;
    border-radius: 20px;
    background-color: #FFD4D4;
    font-size: 16px;
  }

  button {
    width: 50%;
    padding: 12px;
    border: none;
    border-radius: 20px;
    background-color: #A2235E;
    color: white;
    font-family: "Antonio", sans-serif;
    font-style: bold;
    font-size: 24px;
    cursor: pointer;
    margin: 0 auto;
    display: block;
  }

  button:hover {
    background-color: #A2235E;
  }
  </style>
</head>
<body>

  <div class="header">
    Connect me to your<br>WIFI
  </div>

  <div class="form-container">
    <form action="/connect" method="POST">
      <label for="ssid">Name</label>
      <input type="text" id="ssid" name="ssid" placeholder="TYPE(SSID)" required>

      <label for="password">Password</label>
      <input type="password" id="password" name="password" placeholder="TYPE" required>

      <button type="submit">CONNECT</button>
    </form>
  </div>

</body>
</html>
)html";

const char* connecting_page = R"html(
<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KittyPlant WiFi Setup</title>
  <meta name=""description" content="Połącz się ze swoim urządzeniem KittyPlant" />
  <style>
    body
{
    margin: 0;
    background-color: #FAA3AD;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    font-family: "Antonio", sans-serif;
    font-style: light;
  
}

.header {
    background-color: #7AA081;
    color: white;
    padding: 20px 30px;
    border-radius: 20px 20px 20px 20px;
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.1);
    font-size: 20px;
    text-align: center;
  }

  </style>
</head>
<body>

  <div class="header">
    Connecting...
  </div>

</body>
</html>
)html";
