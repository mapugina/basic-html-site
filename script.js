window.addEventListener("load", function() {
    document.querySelector('#title').innerHTML = "Dynamic Title";
    document.querySelector('#timestamp').innerHTML = 
        (new Date()).toString();
});