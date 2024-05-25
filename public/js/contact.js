
  document.addEventListener("DOMContentLoaded", function() {
    const addButton = document.querySelector(".add-comment");
    const formContainer = document.getElementById("comment-container");

    addButton.addEventListener("click", function() {
      formContainer.classList.add("visible");
    });
  });

  const contactForm = document.getElementById("comment-container");
  contactForm.addEventListener("submit", function(event) {
      
      document.getElementById("commentMessage").style.display = "block";
  });
  
