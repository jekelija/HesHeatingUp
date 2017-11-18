//put into helper lib
function postJSON(url, data, success, error) {
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json');
    
    request.onload = ()=> {
        if (request.status >= 200 && request.status < 400) {
            if(success) {
                success(request.response, request.responseType, request.status);
            }
        } else {
            // We reached our target server, but it returned an error
            console.error(request.responseText);
            if(error) {
                error(request.responseText);
            }
        }
    };

    request.onerror = ()=> {
        console.error('Request error');
        // There was a connection error of some sort
        if(error) {
            error(request.responseText);
        }
            
    };
    
    request.send(JSON.stringify(data));
}


document.addEventListener('DOMContentLoaded', ()=> {
    const forms = document.getElementsByClassName('generic-form');
    for(let i = 0; i < forms.length; ++i) {
        const form = forms[i];
        form.addEventListener('submit', (e)=> {
            e.preventDefault();
            if(form.method.toLocaleUpperCase() == 'POST' && form.getAttribute('data-type').toLocaleLowerCase() == 'json') {
                //collect all the inputs and serialize
                const data = {};
                
                const inputs = form.querySelectorAll('input');
                for(let j = 0; j < inputs.length; ++j) {
                    const input = inputs[j];
                    const ignore = input.getAttribute('data-form-ignore');
                    if(!ignore || ignore.toLocaleLowerCase() != 'true') {
                        data[input.name] = input.value;
                    }
                }
                
                postJSON(form.action, data, (response)=> {
                    console.log('success');
                });
            }
        });
        
    }
});