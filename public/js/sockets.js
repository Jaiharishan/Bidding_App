const socket = io('http://localhost:3001')
socket.on('connection')
socket.emit('new-user')

// create the sender message
socket.on('comment', (room, data, user) => {
    
    let fullcomment = document.createElement('div');
    fullcomment.setAttribute('class', 'm-1 align-self-start d-flex flex-column');

    let myuser = document.createElement('p');
    myuser.innerHTML = user; 
    myuser.setAttribute('class', 'm-0 align-self-start mx-2 mb-1');

    let comment = document.createElement('div');
    comment.setAttribute('class', 'btn btn-primary text-light');
    comment.innerHTML = data;

    fullcomment.appendChild(myuser)
    fullcomment.appendChild(comment)
    document.querySelector("#" + room).appendChild(fullcomment);
})


// to send the room and message to server
const sendMessage = (room, id, user) => {
    let data = document.querySelector('#' + id).value;

    document.querySelector('#' + id).value = '';
    console.log(room, id, user);

    socket.emit("comment", room, data, user);

}

// the message copy of the user
const createMessage = (room, id) => {
    console.log('execution works')
    let ourID = '#' + id
    let commentData = document.querySelector('#' + id).value;

    let fullcomment = document.createElement('div');
    fullcomment.setAttribute('class', 'm-1 align-self-end d-flex flex-column');

    let myuser = document.createElement('p');
    myuser.innerHTML = 'you'; 
    myuser.setAttribute('class', 'm-0 align-self-end mx-2 mb-1');

    let mycomment = document.createElement('div');
    mycomment.setAttribute('class', 'm-0 btn btn-primary text-light');
    mycomment.innerHTML = commentData;

    fullcomment.appendChild(myuser)
    fullcomment.appendChild(mycomment)
    document.querySelector("#" + room).appendChild(fullcomment);
}


// we need to create both update and delete functionality to our comment
const updateComment = () => {

}

const deleteComment = (elem, commentname, comment) => {
    console.log('process started')
    let deletingComment = elem.parentElement.parentElement.parentElement.parentElement;
    let parent = deletingComment.parentElement
    parent.removeChild(deletingComment);
    console.log('process done')
    socket.emit('delete', commentname, comment, parent.id)
}

socket.on('delete', (commentname, comment, room) => {
    let parent = document.querySelector("#" + room);
})


const changeBid = () => {

}


const updateTextInput = (val) => {
    let textbox = document.querySelector('.text-input');
    textbox.innerHTML = val;
  }