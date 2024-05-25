 // 1 // Slideshow functionality
 
 let slideIndex = 1;
 showSlides(slideIndex);

 function plusSlides(n) {
   showSlides(slideIndex += n);
 }

 function currentSlide(n) {
   showSlides(slideIndex = n);
 }

 function showSlides(n) {
   let i;
   let slides = document.getElementsByClassName("mySlides");
   let dots = document.getElementsByClassName("dot");
   if (n > slides.length) {
     slideIndex = 1
   }
   if (n < 1) {
     slideIndex = slides.length
   }
   for (i = 0; i < slides.length; i++) {
     slides[i].style.display = "none";
   }
   for (i = 0; i < dots.length; i++) {
     dots[i].className = dots[i].className.replace(" active", "");
   }
   slides[slideIndex - 1].style.display = "block";
   dots[slideIndex - 1].className += " active";
 }
 let queuedImagesArray = [],
   
   queuedForm = document.querySelector("#queued-form"),
   queuedDiv = document.querySelector('.queued-div'),
   inputDiv = document.querySelector('.input-div'),
   input = document.querySelector('.input-div input'),
   serverMessage = document.querySelector('.server-message'),
   deleteImages = [];

 // SAVED IN SERVER - We'll complete in part 2

 // QUEUED IN FRONTEND
 function displayQueuedImages() {
   let images = "";
   queuedImagesArray.forEach((image, index) => {
     images += `<div class="image">
                 <img src="${URL.createObjectURL(image)}" alt="image">
                 <span onclick="deleteQueuedImage(${index})">&times;</span>
               </div>`;
   })
   queuedDiv.innerHTML = images;
 }

 function deleteQueuedImage(index) {
   queuedImagesArray.splice(index, 1);
   displayQueuedImages();
 }

 input.addEventListener("change", () => {
   const files = input.files;
   for (let i = 0; i < files.length; i++) {
     queuedImagesArray.push(files[i])
   }
   queuedForm.reset();
   displayQueuedImages()
 })

 inputDiv.addEventListener("drop", (e) => {
    e.preventDefault()
   const files = e.dataTransfer.files
   for (let i = 0; i < files.length; i++) {
     if (!files[i].type.match("image")) continue; // only photos

     if (queuedImagesArray.every(image => image.name !== files[i].name))
       queuedImagesArray.push(files[i])
   }
   displayQueuedImages()
 })


 inputDiv.addEventListener("dragover", (e) => {
  e.preventDefault(); // Εμποδίζουμε την προεπιλεγμένη συμπεριφορά του browser
});


 