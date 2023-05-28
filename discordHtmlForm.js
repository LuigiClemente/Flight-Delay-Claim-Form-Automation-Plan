<html>
<head>
  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
</head>
<body class="container mt-5">
  <form onsubmit="sendData(event)">
    <div class="mb-3">
      <label for="type">Type</label><br>
      <input type="radio" id="individual" name="type" value="Individual">
      <label for="individual">Individual</label><br>
      <input type="radio" id="collective" name="type" value="Collective">
      <label for="collective">Collective</label><br>
    </div>
    <div class="mb-3">
      <label for="publishNow">Publish now</label><br>
      <input type="checkbox" id="publishNow" name="publishNow" value="Yes">
    </div>
    <!-- Other common fields go here -->
    <!-- ... -->
    <div id="individualFields" style="display: none;">
      <!-- Fields for "individual" type go here -->
      <!-- ... -->
    </div>
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
  <script>
    document.getElementById('individual').addEventListener('change', function() {
      document.getElementById('individualFields').style.display = this.checked ? 'block' : 'none';
    });

    document.getElementById('collective').addEventListener('change', function() {
      document.getElementById('individualFields').style.display = this.checked ? 'none' : 'block';
    });

    async function sendData(ev) {
      ev.preventDefault();

      const type = document
        .getElementById('type').value;
      // Get values of all other fields the same way

      const webhookBody = {
        embeds: [{
          title: 'Form Submitted',
          fields: [
            { name: 'Type', value: type },
            // Include all other fields
          ]
        }],
      };

      const webhookUrl = 'YOUR WEBHOOK URL HERE';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookBody),
      });

      if (response.ok) {
        alert('Your form has been submitted successfully!');
      } else {
        alert('There was an error! Please try again later.');
      }
    }
  </script>
</body>
</html>
