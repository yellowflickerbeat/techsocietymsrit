// Convert file to base64 (used by joinForm)
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// ✅ JOIN FORM
document.addEventListener("DOMContentLoaded", function () {
  const joinForm = document.getElementById('joinForm');
  if (joinForm) {
    joinForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      try {
        const formData = {
          formType: 'joinForm',
          name: document.getElementById('name').value,
          semester: document.getElementById('semester').value,
          role1: document.getElementById('role1').value,
          role2: document.getElementById('role2').value,
          others: document.getElementById('others').value
        };

        const portfolioFile = document.getElementById('portfolio').files[0];
        if (portfolioFile) {
          const base64Data = await fileToBase64(portfolioFile);
          formData.portfolioBase64 = base64Data;
          formData.portfolioName = portfolioFile.name;
          formData.portfolioMimeType = portfolioFile.type;
        }

        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbyyM6RMYwZvR1f0tXqN-gdU37p8uYfzDbHVlZbQu2hAUy1j7udNmg0QllxWePIXLyIrBg/exec',
          {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const result = await response.json();
        if (result.success) {
          alert('Form submitted successfully!');
          joinForm.reset();
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting the form');
      }
    });
  }

  // ✅ IDEA BOX
  const ideaButton = document.querySelector('.idea-box button');
  if (ideaButton) {
    ideaButton.addEventListener('click', async function () {
      try {
        const idea = document.getElementById('ideaBox').value;

        if (!idea.trim()) {
          alert('Please enter an idea');
          return;
        }

        const response = await fetch(
          'https://script.google.com/macros/s/AKfycbyyM6RMYwZvR1f0tXqN-gdU37p8uYfzDbHVlZbQu2hAUy1j7udNmg0QllxWePIXLyIrBg/exec',
          {
            method: 'POST',
            body: JSON.stringify({
              formType: 'ideaBox',
              idea: idea
            }),
            headers: { 'Content-Type': 'application/json' }
          }
        );

        const result = await response.json();
        if (result.success) {
          alert('Idea submitted successfully!');
          document.getElementById('ideaBox').value = '';
        } else {
          alert('Error: ' + result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('There was an error submitting your idea');
      }
    });
  }

  // ✅ USER FORM → MongoDB via Netlify Function
  const userForm = document.getElementById("userForm");
  if (userForm) {
    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(userForm);
      const data = {};
      formData.forEach((value, key) => (data[key] = value));

      try {
        const response = await fetch("/.netlify/functions/storeUser", {
          method: "POST",
          body: JSON.stringify(data),
        });

        const result = await response.json();
        alert(result.message || "Thank you for joining us!");
        userForm.reset();
      } catch (err) {
        console.error("Submission error:", err);
        alert("There was an error submitting the form.");
      }
    });
  }
});