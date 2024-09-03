window.addEventListener("scroll", ()=>{
 const header = document.querySelector("header")
 if(window.scrollY > 60){
    header.classList.add("achicar")
 }else{
    header.classList.remove("achicar")
 }
})




