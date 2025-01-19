const geminiApi = 'localhost:3000/gemini/getResponse'
const input = document.querySelector('input')
const chatOutput = document.querySelector('.chat_output')

let sendBtn = document.querySelector('#pause')
let chatText = document.querySelector('.chat-box form input')

let loginBtn = document.querySelector('.login')
let signupBtn = document.querySelector('.signup')

let welcomeMessage = document.querySelector('.welcome-message') 
let suggestionChips = document.querySelectorAll('.suggestion-chips button')


function formatCode(text)
{
    const keywords = /\b(if|else|while|for|return|break|continue|switch|case|default|try|catch|finally|throw|new|this|super|class|extends|implements|interface|package|import|public|private|protected|static|final|abstract|native|synchronized|volatile|transient|void|int|float|double|boolean|char|short|long|byte|enum|instanceof|void|true|false|null)\b/g;
    if(keywords.test(text)){
        return `<pre class="code-block"><code>${text}</code></pre>`
    }
    return text
}

suggestionChips.forEach((chip)=>{
    chip.addEventListener('click',()=>{
        input.value = chip.textContent
        sendBtn.click()
    })
})

sendBtn.addEventListener('click',async()=>{
    let prompt = input.value.trim()
    if(!prompt){
        window.alert('Please enter a message')
        return
    }

    input.disabled = true
    sendBtn.disabled = true

    const loadingId = 'loading-' + Date.now()
    chatOutput.innerHtml += `<div id="${loadingId}" class="typing-indicator"><span></span><span></span><span></span></div>`

    try{
        const response = await fetch('/gemini/getResponse',{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({prompt})
        })

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json()
        console.log('Response data:', data)

        if (data.status) {
            // Add user message
            chatOutput.innerHTML += `
                <div class="message user-message">
                    <div class="message-content">
                        <span class="user-label">User</span>
                        <p>${prompt}</p>
                    </div>
                </div>
            `;
            
            // Add AI response
            chatOutput.innerHTML += `
                <div class="message nova-message">
                    <div class="message-content">
                        <span class="nova-label">Nova</span>
                        <p>${formatCode(data.text)}</p>
                        <i class="ri-volume-up-line voice-icon"></i>
                    </div>
                </div>
            `;

            // Clear input
            input.value = '';
            
            // Scroll to bottom
            chatOutput.scrollTop = chatOutput.scrollHeight;
        } else {
            console.error('API Error:', data.message);
            window.alert(data.message || 'Something went wrong');
        }
    }
    catch(error){
        console.error('Error:', error)
        window.alert('Something went wrong. Please try again.')
    }
})

input.addEventListener('keypress',(e)=>{
    if(e.key === 'Enter'){
        e.preventDefault(); 
        sendBtn.click()
    }
})

