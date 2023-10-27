let logger = {
    destination : 'http://localhost:3000',
    lastStatus : undefined,
    buffer : '',
    logfileName : {
        dfsAutoLog: "dfsautolog",
        bfsAutoLog : "bfsautolog",
        dfsRightPath : "dfsrightpath",
        bfsRightPath : "bfsrightpath",

        h1AutoLog: "h1autolog",
        h2AutoLog : "h2autolog",
        h1RightPath : "h1rightpath",
        h2RightPath : "h2rightpath"
    },

    addToBuffer : function(data) {
        this.buffer += data;
    },

    flushBuffer : function(logfile, append = false) {
        let sendBuffer = this.buffer;
        this.buffer = '';

        fetch(this.destination, {
            method : 'POST',
            mode : 'same-origin',
            headers : {
                'Content-Type': 'text/plain',
                'logfile': logfile,
                'append' : append
            },
            body : sendBuffer
        })
            .then(response => {
                this.lastStatus = response.status;
                console.log('Logging returned ' + response.status)
            } )
            .catch(response => {
                console.log('Failed to send request');
            });
    }
}

export {logger}