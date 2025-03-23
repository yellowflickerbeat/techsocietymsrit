// Function to convert file to base64
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  
  // Handle Join Form submission
  document.getElementById('joinForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    try {
      // Get form data
      const formData = {
        formType: 'joinForm',
        name: document.getElementById('name').value,
        semester: document.getElementById('semester').value,
        role1: document.getElementById('role1').value,
        role2: document.getElementById('role2').value,
        others: document.getElementById('others').value
      };
      
      // Handle portfolio file if selected
      const portfolioFile = document.getElementById('portfolio').files[0];
      if (portfolioFile) {
        // Convert file to base64
        const base64Data = await fileToBase64(portfolioFile);
        formData.portfolioBase64 = base64Data;
        formData.portfolioName = portfolioFile.name;
        formData.portfolioMimeType = portfolioFile.type;
      }
      
      // Send to Google Apps Script Web App
      const response = await fetch('https://script.google.com/macros/s/AKfycbyyM6RMYwZvR1f0tXqN-gdU37p8uYfzDbHVlZbQu2hAUy1j7udNmg0QllxWePIXLyIrBg/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert('Form submitted successfully!');
        document.getElementById('joinForm').reset();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error submitting the form');
    }
  });
  
  // Handle Idea Box submission
  document.querySelector('.idea-box button').addEventListener('click', async function() {
    try {
      const idea = document.getElementById('ideaBox').value;
      
      if (!idea.trim()) {
        alert('Please enter an idea');
        return;
      }
      
      // Send to Google Apps Script Web App
      const response = await fetch('https://script.google.com/macros/s/AKfycbyyM6RMYwZvR1f0tXqN-gdU37p8uYfzDbHVlZbQu2hAUy1j7udNmg0QllxWePIXLyIrBg/exec', {
        method: 'POST',
        body: JSON.stringify({
          formType: 'ideaBox',
          idea: idea
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
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