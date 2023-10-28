let logger = {
    destination : 'http://localhost:3000',
    lastStatus : undefined,
    buffer : '',
    logfileName : {
        logfile: 'log',
    },

    addToBuffer : function(data) {
        this.buffer += data;
    },

    flushBuffer : async function(logfile, append = false) {
        let sendBuffer = this.buffer;
        this.buffer = '';

        return fetch(this.destination, {
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
                this.lastStatus = response.status;
                console.log('Failed to send request');
            });
    },

    downloadLog : async function(logfile = this.logfileName.logfile) {
        return fetch(this.destination + '/download', {
            method : 'GET',
            mode : 'same-origin',
            headers : {
                logfile: logfile,
            },
        })
            .then(response => response.blob() )
            .then(blob => {
                let url = URL.createObjectURL(blob);

                let link = document.createElement('a');

                link.href = url;
                link.download = logfile + '.txt';
                link.click();

                URL.revokeObjectURL(url);
                link.remove();
            })
    }
}

export {logger}