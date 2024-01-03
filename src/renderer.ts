// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.


const func = async () => {
    const response = await ipcRenderer.invoke('ping');
    console.log(response) // prints out 'pong'
    document.getElementById('clipboard').innerText = response
}

func()

let on = true;
function btnTapped() {
    console.log(on);
    
    if (on) {
        document.getElementById('btn').innerText = 'Check Off';
        document.getElementById('btn').className = 'red';
        ipcRenderer.send('checkName', false);
    } else {
        document.getElementById('btn').innerText = 'Check On';
        document.getElementById('btn').className = 'green';
        ipcRenderer.send('checkName', true);
    }
    on = !on;
}