import { http } from './http';
import { ui } from './ui';

// Get posts on DOM load
document.addEventListener('DOMContentLoaded', getPosts);
document.querySelector(".post-submit").addEventListener("click", submitPost);
document.querySelector("#posts").addEventListener("click", deletePost)
document.querySelector("#posts").addEventListener("click", enableEdit);
document.querySelector(".card-form").addEventListener("click", cancelEdit);
document.querySelector("#clearAll").addEventListener("click", deletePosts);

function getPosts() {
  http.get('http://localhost:3000/posts')
    .then(data => ui.showPosts(data))
    .catch(err => console.log(err));
}
function submitPost(){

    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const id = document.getElementById("id").value;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 
    var time = today.getHours() + ":" + today.getMinutes();
    var date_ = `Last edit: ${time}/${date} `;   
    const data ={
        title,
        body,
        date_
    }
    if(title === "" || body === " "){
        ui.showAlert("Please fill in all fields", "alert alert-danger")
    }
    else{
        if(id === ""){
            //create Post
                
        http.post('http://localhost:3000/posts', data)
        .then(data => {
            ui.showAlert("Post Added", "alert alert-success");
            ui.clearFields();
            getPosts()
        })
        .catch(err => console.log(err))
         
        }
        else{
            //We need to update the post
            http.put(`http://localhost:3000/posts/${id}`, data)
            .then(data => {
                ui.showAlert("Post Updated", "alert alert-success");
                ui.changeFormState("add");
                getPosts()
            })
            .catch(err => console.log(err))
        }


  
    }
    
}
function deletePost(e){
    if(e.target.parentElement.classList.contains("delete")){
        const id=e.target.parentElement.dataset.id;
        if(confirm("Are you sure?")){
            http.delete(`http://localhost:3000/posts/${id}`)
            .then(data => {
                ui.showAlert("post Removed", "alert alert-success");
                getPosts();
            })
            .catch(err => console.log(err))
        }
    }
    // http.delete('http://localhost:3000/posts');

    e.preventDefault();
}
function enableEdit(e){
   if(e.target.parentElement.classList.contains("edit")){
    const id = e.target.parentElement.dataset.id;
    const body = e.target.parentElement.previousElementSibling.textContent;
    const title = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.textContent;
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate(); 
    var time = today.getHours() + ":" + today.getMinutes();
    var date_ = `Last edit: ${time}/${date} `;   
    const data = {
        id,
        body,
        title,
        date_
    }
    ui.fillForm(data)
    }
    e.preventDefault();
}
function cancelEdit(e){
    if(e.target.classList.contains("post-cancel")){
        ui.changeFormState("add");
    }


    e.preventDefault();

}
function deletePosts(){
    http.get('http://localhost:3000/posts')
    .then(
        function(posts){
            if(confirm("Are you sure?")){

            posts.forEach(post => {
                const id = post.id;
                    http.delete(`http://localhost:3000/posts/${id}`)
                    .then(data => {
                        getPosts();
                    })
                    .catch(err => console.log(err))
                
            });
            // ui.showAlert("posts Removed", "alert alert-success");

        }
        }
    )
    .catch(err => console.log(err));
}



//we post an image (optional) when posting a post 

const start = Date.now();
console.log(start)