let logger = {
    destination : 'http://localhost:3000',
    lastStatus : undefined,
    buffer : '',
    logfileName : {
        dfsAutoLog: "dfsautolog",
        bfsAutoLog : "bfsautolog",
        rightPath1 : "rightpath1",

        h1AutoLog: "h1autolog",
        h2AutoLog : "h2autolog",
        rightPath2 : "rightpath2",
    },

    addToBuffer : function(data) {
        this.buffer += data;
    },

    flushBuffer : function(logfile, append = false) {
        fetch(this.destination, {
            method : 'POST',
            mode : 'same-origin',
            headers : {
                'Content-Type': 'text/plain',
                'logfile': logfile,
                'append' : append
            },
            body : this.buffer
        })
            .then(response => {
                this.buffer = '';
                this.lastStatus = response.status;
                console.log('Logging returned ' + response.status)
            } )
            .catch(response => {
                console.log('Failed to send request');
            });
    }
}

export {logger}